const { db, auth } = require('../config/firebase');
const admin = require('firebase-admin');
const { decrypt } = require('../services/encryption.service');

const adminController = {
  /**
   * Aggregate Key Performance Indicators for the Admin Dashboard Home
   */
  async getOverview(req, res, next) {
    try {
      // 1. Query donations collections to calculate metrics
      const donationsSnap = await db.collection('donations').get();
      
      let totalRaised = 0;
      let successfulDonations = 0;
      let pendingDonations = 0;
      let failedDonations = 0;
      
      const categoryBreakdown = { Education: 0, Healthcare: 0, Community: 0 };
      const last7DaysRevenue = {};

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      donationsSnap.forEach(doc => {
        const d = doc.data();
        if (d.status === 'successful') {
          totalRaised += d.amount;
          successfulDonations++;
          
          if (d.category && categoryBreakdown[d.category] !== undefined) {
            categoryBreakdown[d.category] += d.amount;
          }

          const date = d.createdAt ? new Date(d.createdAt._seconds ? d.createdAt._seconds * 1000 : d.createdAt) : new Date();
          if (date >= sevenDaysAgo) {
            const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            last7DaysRevenue[dateStr] = (last7DaysRevenue[dateStr] || 0) + d.amount;
          }
        } else if (d.status === 'pending') {
          pendingDonations++;
        } else if (d.status === 'failed') {
          failedDonations++;
        }
      });

      // Format 7 days revenue to array format
      const revenueTrend = Object.keys(last7DaysRevenue).map(date => ({
        date,
        amount: last7DaysRevenue[date]
      })).slice(-7);

      // 2. Aggregate unique donors count
      const usersSnap = await db.collection('users').where('role', '==', 'donor').get();
      const totalDonors = usersSnap.size;

      return res.status(200).json({
        success: true,
        stats: {
          totalRaised,
          totalDonors,
          successfulDonations,
          pendingDonations,
          failedDonations,
          monthlyGrowth: 12.5 // Mock trend growth
        },
        categoryBreakdown,
        revenueTrend
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * List all donations with filtration, search, and page index offset pagination
   */
  async getDonations(req, res, next) {
    try {
      const { page = 1, limit = 10, status, category, type, search } = req.query;

      let queryRef = db.collection('donations');

      if (status) queryRef = queryRef.where('status', '==', status);
      if (category) queryRef = queryRef.where('category', '==', category);
      if (type) queryRef = queryRef.where('donationType', '==', type);

      queryRef = queryRef.orderBy('createdAt', 'desc');

      const fullSnap = await queryRef.get();
      const allDocs = [];
      
      fullSnap.forEach(doc => {
        const data = doc.data();
        allDocs.push({
          id: doc.id,
          ...data
        });
      });

      // Filter local array if search is provided (to support easy full text search on Email, Name, or PaymentID)
      let filteredDocs = allDocs;
      if (search) {
        const q = search.toLowerCase();
        filteredDocs = allDocs.filter(d => 
          (d.donorName && d.donorName.toLowerCase().includes(q)) ||
          (d.donorEmail && d.donorEmail.toLowerCase().includes(q)) ||
          (d.donationId && d.donationId.toLowerCase().includes(q)) ||
          (d.orderId && d.orderId.toLowerCase().includes(q))
        );
      }

      const total = filteredDocs.length;
      const pageVal = parseInt(page);
      const limitVal = parseInt(limit);
      const offset = (pageVal - 1) * limitVal;
      const paginatedDocs = filteredDocs.slice(offset, offset + limitVal);

      return res.status(200).json({
        success: true,
        donations: paginatedDocs,
        total,
        page: pageVal,
        hasMore: total > pageVal * limitVal
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
          success: true,
          donation: {
            id: doc.id,
            ...data
          }
        });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Edit/Override stuck transaction status (e.g. resolve stuck pending payments manually)
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

      await donationRef.update({
        status,
        adminNotes: notes || 'Manually updated by Administrator',
        updatedAt: admin.firestore.Timestamp.fromDate(new Date())
      });

      return res.status(200).json({
        success: true,
        message: `Donation transaction status manually overridden to: ${status}`
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * List all system users with filters
   */
  async getUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, role, search } = req.query;

      let queryRef = db.collection('users');

      if (role) queryRef = queryRef.where('role', '==', role);

      queryRef = queryRef.orderBy('createdAt', 'desc');

      const fullSnap = await queryRef.get();
      const allUsers = [];
      
      fullSnap.forEach(doc => {
        allUsers.push({ id: doc.id, ...doc.data() });
      });

      let filteredUsers = allUsers;
      if (search) {
        const q = search.toLowerCase();
        filteredUsers = allUsers.filter(u => 
          (u.fullName && u.fullName.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.phone && u.phone.includes(q))
        );
      }

      const total = filteredUsers.length;
      const pageVal = parseInt(page);
      const limitVal = parseInt(limit);
      const offset = (pageVal - 1) * limitVal;
      const paginatedUsers = filteredUsers.slice(offset, offset + limitVal);

      return res.status(200).json({
        success: true,
        users: paginatedUsers,
        total,
        page: pageVal,
        hasMore: total > pageVal * limitVal
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
      const { uid } = req.params;
      const { isActive } = req.body;

      if (isActive === undefined) {
        return res.status(400).json({ error: 'isActive Boolean flag is required' });
      }

      // 1. Update active flag in Firestore
      await db.collection('users').doc(uid).update({
        isActive,
        updatedAt: admin.firestore.Timestamp.fromDate(new Date())
      });

      // 2. Update state in Firebase Auth
      await auth.updateUser(uid, {
        disabled: !isActive
      });

      return res.status(200).json({
        success: true,
        message: `User account has been successfully ${isActive ? 'enabled' : 'disabled'}`
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * List all submitted helpline contact forms
   */
  async getContacts(req, res, next) {
    try {
      const { page = 1, limit = 10, status } = req.query;

      let queryRef = db.collection('contacts');

      if (status) queryRef = queryRef.where('status', '==', status);

      queryRef = queryRef.orderBy('createdAt', 'desc');

      const fullSnap = await queryRef.get();
      const list = [];
      fullSnap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });

      const total = list.length;
      const pageVal = parseInt(page);
      const limitVal = parseInt(limit);
      const offset = (pageVal - 1) * limitVal;
      const paginatedList = list.slice(offset, offset + limitVal);

      return res.status(200).json({
        success: true,
        contacts: paginatedList,
        total
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
      const { contactId } = req.params;
      const { status, adminNotes, assignedTo } = req.body;

      const contactRef = db.collection('contacts').doc(contactId);
      const doc = await contactRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Contact inquiry not found' });
      }

      const updates = {};
      if (status) updates.status = status;
      if (adminNotes) updates.adminNotes = adminNotes;
      if (assignedTo) updates.assignedTo = assignedTo;
      
      updates.updatedAt = admin.firestore.Timestamp.fromDate(new Date());
      if (status === 'resolved') updates.resolvedAt = admin.firestore.Timestamp.fromDate(new Date());
      if (status === 'replied') updates.repliedAt = admin.firestore.Timestamp.fromDate(new Date());

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
   * List partnership applications
   */
  async getApplications(req, res, next) {
    try {
      const { page = 1, limit = 10, type, status } = req.query;

      let queryRef = db.collection('community_applications');

      if (type) queryRef = queryRef.where('type', '==', type);
      if (status) queryRef = queryRef.where('status', '==', status);

      queryRef = queryRef.orderBy('createdAt', 'desc');

      const fullSnap = await queryRef.get();
      const list = [];
      fullSnap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });

      const total = list.length;
      const pageVal = parseInt(page);
      const limitVal = parseInt(limit);
      const offset = (pageVal - 1) * limitVal;
      const paginatedList = list.slice(offset, offset + limitVal);

      return res.status(200).json({
        success: true,
        applications: paginatedList,
        total
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

      if (status) queryRef = queryRef.where('status', '==', status);
      if (category) queryRef = queryRef.where('category', '==', category);
      if (type) queryRef = queryRef.where('donationType', '==', type);

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
          d.donationId || '',
          d.orderId || '',
          d.userId || '',
          d.donorName || '',
          d.donorEmail || '',
          d.donorPhone || '',
          d.amount || 0,
          d.category || '',
          d.subcategory || '',
          d.donationType || '',
          d.status || '',
          d.paymentMethod || '',
          d.receiptNumber || '',
          formattedDate
        ];

        // Format CSV values to handle commas/quotes properly
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
