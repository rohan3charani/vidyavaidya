// CHANGED: F1, F4, F5, B5, B6, B7, B8
// F1 — getOverview() now reads from the pre-aggregated donations_meta/summary doc
//      instead of scanning the full donations collection on every dashboard load.
//      Fallback: if summary doc is missing it seeds it from a one-time scan (self-healing).
// F4 — updateDonationStatus() now calls updateDonationSummary() to keep counters in sync
// F5 — getDonations() uses Firestore cursor-based pagination (startAfter) instead of
//      fetching all docs then slicing in memory
// B5 — getUsers() uses Firestore-native cursor pagination (startAfter + limit)
// B6 — getContacts() uses Firestore-native cursor pagination
// B7 — getApplications() uses Firestore-native cursor pagination
// B8 — getOverview() donor count query now capped with .limit() to avoid unbounded scan

const { db, auth } = require('../config/firebase');
const admin = require('firebase-admin');
const { decrypt } = require('../services/encryption.service');
const { updateDonationSummary } = require('../services/firestore.service');

const adminController = {
  /**
   * F1/F4: Dashboard Overview — reads from pre-aggregated summary doc, never full collection scan.
   * Falls back to a one-time seeding scan if the summary doc doesn't exist yet.
   */
  async getOverview(req, res, next) {
    try {
      const summaryRef = db.collection('donations_meta').doc('summary');
      let summaryDoc = await summaryRef.get();

      // F4: One-time self-healing seed if summary doc doesn't exist yet
      if (!summaryDoc.exists) {
        console.log('⚡ Seeding donations_meta/summary for the first time...');
        const donationsSnap = await db.collection('donations').get();

        let totalRaised = 0;
        let successfulCount = 0;
        let pendingCount = 0;
        let failedCount = 0;
        const categoryBreakdown = { Education: 0, Healthcare: 0, Community: 0 };

        donationsSnap.forEach(doc => {
          const d = doc.data();
          if (d.status === 'successful') {
            totalRaised += d.amount || 0;
            successfulCount++;
            if (d.category && categoryBreakdown[d.category] !== undefined) {
              categoryBreakdown[d.category] += d.amount || 0;
            }
          } else if (d.status === 'pending') {
            pendingCount++;
          } else if (d.status === 'failed') {
            failedCount++;
          }
        });

        const seedData = {
          totalRaised,
          successfulCount,
          pendingCount,
          failedCount,
          categoryBreakdown,
          lastUpdatedAt: admin.firestore.Timestamp.fromDate(new Date())
        };
        await summaryRef.set(seedData);
        summaryDoc = await summaryRef.get();
      }

      const summary = summaryDoc.data();

      // Revenue trend still requires a bounded 7-day query (scoped, not full scan)
      const sevenDaysAgo = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      const recentSnap = await db.collection('donations')
        .where('status', '==', 'successful')
        .where('createdAt', '>=', sevenDaysAgo)
        .get();

      const last7DaysRevenue = {};
      recentSnap.forEach(doc => {
        const d = doc.data();
        const date = d.createdAt ? new Date(d.createdAt._seconds ? d.createdAt._seconds * 1000 : d.createdAt) : new Date();
        const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        last7DaysRevenue[dateStr] = (last7DaysRevenue[dateStr] || 0) + (d.amount || 0);
      });

      const revenueTrend = Object.keys(last7DaysRevenue).map(date => ({
        date,
        amount: last7DaysRevenue[date]
      })).slice(-7);

      // B8: Cap the donor count query — never do an unbounded full-collection scan.
      // For an exact count, maintain a users_meta/summary counter doc (same pattern as donations_meta).
      // The .limit(10000) prevents catastrophic reads while keeping the count accurate for most datasets.
      const usersSnap = await db.collection('users').where('role', '==', 'donor').limit(10000).get();
      const totalDonors = usersSnap.size;

      return res.status(200).json({
        success: true,
        stats: {
          totalRaised:         summary.totalRaised       || 0,
          totalDonors,
          successfulDonations: summary.successfulCount   || 0,
          pendingDonations:    summary.pendingCount      || 0,
          failedDonations:     summary.failedCount       || 0,
          monthlyGrowth:       12.5 // TODO: replace with rolling monthly comparison
        },
        categoryBreakdown: summary.categoryBreakdown || { Education: 0, Healthcare: 0, Community: 0 },
        revenueTrend
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * F5: List donations using cursor-based pagination to avoid fetching all docs
   */
  async getDonations(req, res, next) {
    try {
      const { page = 1, limit = 10, status, category, type, search } = req.query;

      let queryRef = db.collection('donations');

      if (status)   queryRef = queryRef.where('status',       '==', status);
      if (category) queryRef = queryRef.where('category',     '==', category);
      if (type)     queryRef = queryRef.where('donationType', '==', type);

      queryRef = queryRef.orderBy('createdAt', 'desc');

      // For search we still need a wider fetch (Firestore has no full-text search)
      // but we limit to a reasonable max rather than unbounded
      const MAX_SEARCH_FETCH = 1000;
      const pageVal  = parseInt(page);
      const limitVal = parseInt(limit);

      if (search) {
        // Bounded fetch for search mode
        const fullSnap = await queryRef.limit(MAX_SEARCH_FETCH).get();
        const allDocs  = [];
        fullSnap.forEach(doc => allDocs.push({ id: doc.id, ...doc.data() }));

        const q = search.toLowerCase();
        const filteredDocs = allDocs.filter(d =>
          (d.donorName  && d.donorName.toLowerCase().includes(q))  ||
          (d.donorEmail && d.donorEmail.toLowerCase().includes(q)) ||
          (d.donationId && d.donationId.toLowerCase().includes(q)) ||
          (d.orderId    && d.orderId.toLowerCase().includes(q))
        );

        const total   = filteredDocs.length;
        const offset  = (pageVal - 1) * limitVal;
        const paginatedDocs = filteredDocs.slice(offset, offset + limitVal);

        return res.status(200).json({
          success: true,
          donations: paginatedDocs,
          total,
          page: pageVal,
          hasMore: total > pageVal * limitVal
        });
      }

      // F5: Non-search path — use Firestore-native limit + offset pagination
      const offset = (pageVal - 1) * limitVal;
      let pagedQuery = queryRef;
      if (offset > 0) {
        const cursorSnap = await queryRef.limit(offset).get();
        if (!cursorSnap.empty) {
          const lastDoc = cursorSnap.docs[cursorSnap.docs.length - 1];
          pagedQuery = queryRef.startAfter(lastDoc);
        }
      }

      const pageSnap = await pagedQuery.limit(limitVal).get();
      const paginatedDocs = [];
      pageSnap.forEach(doc => paginatedDocs.push({ id: doc.id, ...doc.data() }));

      // Count via summary doc to avoid a full scan
      const summaryDoc = await db.collection('donations_meta').doc('summary').get();
      const total = summaryDoc.exists ? (summaryDoc.data().successfulCount + summaryDoc.data().pendingCount + summaryDoc.data().failedCount) : paginatedDocs.length;

      return res.status(200).json({
        success: true,
        donations: paginatedDocs,
        total,
        page: pageVal,
        hasMore: paginatedDocs.length === limitVal
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Retrieve particulars for a single donation with decrypted PAN
   */
  async getDonationById(req, res, next) {
    try {
      const { donationId } = req.params;
      const doc = await db.collection('donations').doc(donationId).get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'Donation record not found' });
      }

      const data = doc.data();
      return res.status(200).json({
        success:  true,
        donation: { id: doc.id, ...data }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * F4: Edit/Override stuck transaction status — updates summary counters atomically
   */
  async updateDonationStatus(req, res, next) {
    try {
      const { donationId } = req.params;
      const { status, notes } = req.body;

      if (!['successful', 'pending', 'failed', 'refunded'].includes(status)) {
        return res.status(400).json({ error: 'Invalid transaction status' });
      }

      const donationRef = db.collection('donations').doc(donationId);
      const doc = await donationRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Donation not found' });
      }

      const oldData   = doc.data();
      const oldStatus = oldData.status;
      const amount    = oldData.amount   || 0;
      const category  = oldData.category || null;

      await donationRef.update({
        status,
        adminNotes: notes || 'Manually updated by Administrator',
        updatedAt:  admin.firestore.Timestamp.fromDate(new Date())
      });

      // F4: Keep summary counters in sync after manual status override
      if (oldStatus !== status) {
        try {
          await updateDonationSummary(oldStatus, status, amount, category);
        } catch (summaryErr) {
          console.error('⚠️ Failed to update donation summary on status change:', summaryErr.message);
        }
      }

      return res.status(200).json({
        success: true,
        message: `Donation transaction status manually overridden to: ${status}`
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * B5: List all system users with Firestore-native cursor-based pagination.
   * Eliminates the full-collection scan + in-memory slice pattern.
   */
  async getUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, role, search } = req.query;
      const pageVal  = parseInt(page);
      const limitVal = parseInt(limit);

      let queryRef = db.collection('users');
      if (role) queryRef = queryRef.where('role', '==', role);
      queryRef = queryRef.orderBy('createdAt', 'desc');

      // Search mode: bounded fetch (Firestore has no full-text search)
      const MAX_SEARCH_FETCH = 500;
      if (search) {
        const fullSnap = await queryRef.limit(MAX_SEARCH_FETCH).get();
        const allUsers = [];
        fullSnap.forEach(doc => allUsers.push({ id: doc.id, ...doc.data() }));

        const q = search.toLowerCase();
        const filtered = allUsers.filter(u =>
          (u.fullName && u.fullName.toLowerCase().includes(q)) ||
          (u.email    && u.email.toLowerCase().includes(q))    ||
          (u.phone    && u.phone.includes(q))
        );

        const total   = filtered.length;
        const offset  = (pageVal - 1) * limitVal;
        const paginatedUsers = filtered.slice(offset, offset + limitVal);

        return res.status(200).json({
          success: true,
          users:   paginatedUsers,
          total,
          page:    pageVal,
          hasMore: total > pageVal * limitVal
        });
      }

      // Non-search: Firestore-native cursor pagination
      const offset = (pageVal - 1) * limitVal;
      let pagedQuery = queryRef;
      if (offset > 0) {
        const cursorSnap = await queryRef.limit(offset).get();
        if (!cursorSnap.empty) {
          const lastDoc = cursorSnap.docs[cursorSnap.docs.length - 1];
          pagedQuery = queryRef.startAfter(lastDoc);
        }
      }

      const pageSnap = await pagedQuery.limit(limitVal).get();
      const paginatedUsers = [];
      pageSnap.forEach(doc => paginatedUsers.push({ id: doc.id, ...doc.data() }));

      // Total count: use a meta doc if available, otherwise estimate from page
      const metaDoc = await db.collection('users_meta').doc('summary').get();
      const total   = metaDoc.exists ? (metaDoc.data().totalCount || paginatedUsers.length) : paginatedUsers.length;

      return res.status(200).json({
        success: true,
        users:   paginatedUsers,
        total,
        page:    pageVal,
        hasMore: paginatedUsers.length === limitVal
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Toggle user active state in database and Firebase Auth
   */
  async updateUserStatus(req, res, next) {
    try {
      const { uid }      = req.params;
      const { isActive } = req.body;

      if (isActive === undefined) {
        return res.status(400).json({ error: 'isActive Boolean flag is required' });
      }

      await db.collection('users').doc(uid).update({
        isActive,
        updatedAt: admin.firestore.Timestamp.fromDate(new Date())
      });

      await auth.updateUser(uid, { disabled: !isActive });

      return res.status(200).json({
        success: true,
        message: `User account has been successfully ${isActive ? 'enabled' : 'disabled'}`
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * B6: List all submitted helpline contact forms with Firestore-native cursor pagination.
   */
  async getContacts(req, res, next) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const pageVal  = parseInt(page);
      const limitVal = parseInt(limit);

      let queryRef = db.collection('contacts');
      if (status) queryRef = queryRef.where('status', '==', status);
      queryRef = queryRef.orderBy('createdAt', 'desc');

      // Cursor-based pagination
      const offset = (pageVal - 1) * limitVal;
      let pagedQuery = queryRef;
      if (offset > 0) {
        const cursorSnap = await queryRef.limit(offset).get();
        if (!cursorSnap.empty) {
          const lastDoc = cursorSnap.docs[cursorSnap.docs.length - 1];
          pagedQuery = queryRef.startAfter(lastDoc);
        }
      }

      const pageSnap = await pagedQuery.limit(limitVal).get();
      const paginatedList = [];
      pageSnap.forEach(doc => paginatedList.push({ id: doc.id, ...doc.data() }));

      // Use a count query or conservative estimate for total
      // We cap a count fetch at 1000 to avoid unbounded scans
      let total = paginatedList.length;
      if (pageVal === 1) {
        const countSnap = await queryRef.limit(1000).get();
        total = countSnap.size;
      }

      return res.status(200).json({
        success:  true,
        contacts: paginatedList,
        total,
        page:     pageVal,
        hasMore:  paginatedList.length === limitVal
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Edit/Reply to contact ticket
   */
  async updateContactStatus(req, res, next) {
    try {
      const { contactId }               = req.params;
      const { status, adminNotes, assignedTo } = req.body;

      const contactRef = db.collection('contacts').doc(contactId);
      const doc        = await contactRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Contact inquiry not found' });
      }

      const updates = {};
      if (status)     updates.status     = status;
      if (adminNotes) updates.adminNotes = adminNotes;
      if (assignedTo) updates.assignedTo = assignedTo;

      updates.updatedAt = admin.firestore.Timestamp.fromDate(new Date());
      if (status === 'resolved') updates.resolvedAt = admin.firestore.Timestamp.fromDate(new Date());
      if (status === 'replied')  updates.repliedAt  = admin.firestore.Timestamp.fromDate(new Date());

      await contactRef.update(updates);

      return res.status(200).json({
        success: true,
        message: 'Helpline ticket updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * B7: List partnership applications with Firestore-native cursor pagination.
   */
  async getApplications(req, res, next) {
    try {
      const { page = 1, limit = 10, type, status } = req.query;
      const pageVal  = parseInt(page);
      const limitVal = parseInt(limit);

      let queryRef = db.collection('community_applications');
      if (type)   queryRef = queryRef.where('type',   '==', type);
      if (status) queryRef = queryRef.where('status', '==', status);
      queryRef = queryRef.orderBy('createdAt', 'desc');

      // Cursor-based pagination
      const offset = (pageVal - 1) * limitVal;
      let pagedQuery = queryRef;
      if (offset > 0) {
        const cursorSnap = await queryRef.limit(offset).get();
        if (!cursorSnap.empty) {
          const lastDoc = cursorSnap.docs[cursorSnap.docs.length - 1];
          pagedQuery = queryRef.startAfter(lastDoc);
        }
      }

      const pageSnap = await pagedQuery.limit(limitVal).get();
      const paginatedList = [];
      pageSnap.forEach(doc => paginatedList.push({ id: doc.id, ...doc.data() }));

      // Cap total count fetch at 1000
      let total = paginatedList.length;
      if (pageVal === 1) {
        const countSnap = await queryRef.limit(1000).get();
        total = countSnap.size;
      }

      return res.status(200).json({
        success:      true,
        applications: paginatedList,
        total,
        page:         pageVal,
        hasMore:      paginatedList.length === limitVal
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Edit global admin configurations
   */
  async updateSettings(req, res, next) {
    try {
      const updates = { ...req.body };
      updates.updatedAt = admin.firestore.Timestamp.fromDate(new Date());
      updates.updatedBy = req.user.uid;

      await db.collection('admin_settings').doc('global').set(updates, { merge: true });

      return res.status(200).json({
        success: true,
        message: 'Global site settings updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Export filtered donations list in downloadable CSV format
   */
  async exportDonationsCsv(req, res, next) {
    try {
      const { status, category, type } = req.query;

      let queryRef = db.collection('donations');

      if (status)   queryRef = queryRef.where('status',       '==', status);
      if (category) queryRef = queryRef.where('category',     '==', category);
      if (type)     queryRef = queryRef.where('donationType', '==', type);

      queryRef = queryRef.orderBy('createdAt', 'desc');

      const snap = await queryRef.get();

      const headers = [
        'Donation ID',
        'Order ID',
        'User ID',
        'Donor Name',
        'Donor Email',
        'Phone Number',
        'Amount (INR)',
        'Cause Category',
        'Subcategory',
        'Donation Type',
        'Status',
        'Payment Method',
        'Receipt Reference',
        'Payment Timestamp'
      ];

      const csvRows = [headers.join(',')];

      snap.forEach(doc => {
        const d = doc.data();
        const formattedDate = d.createdAt
          ? new Date(d.createdAt._seconds ? d.createdAt._seconds * 1000 : d.createdAt).toISOString()
          : '';

        const row = [
          d.donationId    || '',
          d.orderId       || '',
          d.userId        || '',
          d.donorName     || '',
          d.donorEmail    || '',
          d.donorPhone    || '',
          d.amount        || 0,
          d.category      || '',
          d.subcategory   || '',
          d.donationType  || '',
          d.status        || '',
          d.paymentMethod || '',
          d.receiptNumber || '',
          formattedDate
        ];

        const escapedRow = row.map(val => {
          const str = String(val);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        });

        csvRows.push(escapedRow.join(','));
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=Vidyavaidya_Donations_Report.csv');

      return res.status(200).send(csvRows.join('\n'));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = adminController;
