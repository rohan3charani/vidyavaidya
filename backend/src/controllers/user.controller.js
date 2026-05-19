const { auth, db } = require('../config/firebase');
const receiptService = require('../services/receipt.service');
const admin = require('firebase-admin');
const { encrypt, decrypt } = require('../services/encryption.service');

const userController = {
  /**
   * Get user profile details
   */
  async getProfile(req, res, next) {
    try {
      const uid = req.user.uid;
      const doc = await db.collection('users').doc(uid).get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'User profile not found' });
      }
      const profileData = doc.data();
      return res.status(200).json({ success: true, profile: profileData });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update user profile details
   */
  async updateProfile(req, res, next) {
    try {
      const uid = req.user.uid;
      const { 
        fullName, 
        phone, 
        mobile, 
        address, 
        city, 
        state, 
        country, 
        pincode, 
        isAlumni, 
        alumniId, 
        yearOfGraduation, 
        gradYear
      } = req.body;

      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User profile not found' });
      }

      const updates = {};
      if (fullName) {
        updates.fullName = fullName;
        // Synchronize display name in Firebase Auth (only if real Firebase user)
        if (uid && !uid.startsWith('local-')) {
          try {
            await auth.updateUser(uid, { displayName: fullName });
          } catch (authError) {
            console.warn(`⚠️ Failed to sync display name in Firebase Auth: ${authError.message}`);
          }
        }
      }
      
      const userPhone = phone || mobile;
      if (userPhone) updates.phone = userPhone;
      
      if (isAlumni !== undefined) updates.isAlumni = isAlumni;
      if (alumniId) updates.alumniId = alumniId;
      
      const grad = yearOfGraduation || gradYear;
      if (grad) updates.yearOfGraduation = Number(grad);

      // Reconstruct the address object if any address field is updated
      if (address !== undefined || city !== undefined || state !== undefined || country !== undefined || pincode !== undefined) {
        const currentData = userDoc.data();
        const currentAddress = (currentData.address && typeof currentData.address === 'object') ? currentData.address : {};
        
        updates.address = {
          line: address !== undefined ? address : (currentAddress.line || ''),
          city: city !== undefined ? city : (currentAddress.city || ''),
          state: state !== undefined ? state : (currentAddress.state || ''),
          country: country !== undefined ? country : (currentAddress.country || 'India'),
          pincode: pincode !== undefined ? pincode : (currentAddress.pincode || '')
        };
      }

      updates.profileComplete = true;
      updates.updatedAt = admin.firestore.Timestamp.fromDate(new Date());

      await userRef.update(updates);

      const finalDoc = await userRef.get();
      const profileData = finalDoc.data();
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        profile: profileData
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get aggregated stats for the user dashboard
   */
  async getDashboard(req, res, next) {
    try {
      const uid = req.user.uid;

      // 1. Fetch user doc for fallback/basic profile details
      const userDoc = await db.collection('users').doc(uid).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User profile not found' });
      }
      const userData = userDoc.data();

      // 2. Fetch all user donations (Avoids composite index requirement)
      const donationsSnap = await db.collection('donations')
        .where('userId', '==', uid)
        .get();

      const allDonations = [];
      donationsSnap.forEach(doc => allDonations.push({ id: doc.id, ...doc.data() }));

      // 3. Compute stats dynamically (case-insensitive and type checking)
      const getStatusStr = (d) => (d.status || '').toString().toLowerCase();

      const successfulDonations = allDonations
        .filter(d => getStatusStr(d) === 'successful')
        .sort((a, b) => {
          const getMillis = (item) => {
            if (!item.createdAt) return 0;
            if (typeof item.createdAt.toMillis === 'function') return item.createdAt.toMillis();
            if (typeof item.createdAt.toDate === 'function') return item.createdAt.toDate().getTime();
            if (item.createdAt._seconds) return item.createdAt._seconds * 1000;
            if (item.createdAt.seconds) return item.createdAt.seconds * 1000;
            return new Date(item.createdAt).getTime();
          };
          return getMillis(b) - getMillis(a);
        });

      const failedCount = allDonations.filter(d => getStatusStr(d) === 'failed').length;
      const pendingCount = allDonations.filter(d => getStatusStr(d) === 'pending').length;
      const totalDonated = successfulDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
      const contributionsCount = successfulDonations.length;

      const recurringCount = successfulDonations.filter(d => 
        d.isRecurring === true || 
        (d.donationType || '').toString().toLowerCase() === 'monthly' ||
        (d.frequency || '').toString().toLowerCase() === 'monthly'
      ).length;

      const oneTimeCount = successfulDonations.filter(d => 
        d.isRecurring !== true && 
        (d.donationType || '').toString().toLowerCase() !== 'monthly' &&
        (d.frequency || '').toString().toLowerCase() !== 'monthly'
      ).length;

      const latestDonation = successfulDonations.length > 0 ? successfulDonations[0] : null;

      // Sync Firestore user document if the aggregated stats mismatch
      if (totalDonated !== userData.totalDonated || contributionsCount !== userData.donationCount) {
        try {
          await db.collection('users').doc(uid).update({
            totalDonated: totalDonated,
            donationCount: contributionsCount,
            updatedAt: admin.firestore.Timestamp.fromDate(new Date())
          });
        } catch (syncErr) {
          console.warn('⚠️ User profile sync failed:', syncErr.message);
        }
      }

      // 4. Aggregations (Categories & Months)
      const categoryBreakdown = { Education: 0, Healthcare: 0, Community: 0 };
      const monthlyChart = {};
      const monthlyFrequency = {};

      successfulDonations.forEach(data => {
        // Aggregate categories
        const cat = data.category || 'General';
        if (categoryBreakdown[cat] === undefined) {
          categoryBreakdown[cat] = 0;
        }
        categoryBreakdown[cat] += data.amount;

        // Aggregate monthly stats
        let date = new Date();
        if (data.createdAt) {
          if (typeof data.createdAt.toDate === 'function') {
            date = data.createdAt.toDate();
          } else if (data.createdAt._seconds) {
            date = new Date(data.createdAt._seconds * 1000);
          } else if (data.createdAt.seconds) {
            date = new Date(data.createdAt.seconds * 1000);
          } else {
            date = new Date(data.createdAt);
          }
        }
        if (date && !isNaN(date.getTime())) {
          const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
          monthlyChart[monthYear] = (monthlyChart[monthYear] || 0) + data.amount;
          monthlyFrequency[monthYear] = (monthlyFrequency[monthYear] || 0) + 1;
        }
      });

      // Sort months chronologically helper
      const parseMonthYear = (str) => {
        const [month, year] = str.split(' ');
        const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
        return new Date(2000 + parseInt(year), months[month] || 0, 1);
      };

      const sortedMonths = Object.keys(monthlyChart).sort((a, b) => parseMonthYear(a) - parseMonthYear(b));

      const monthlyChartArray = sortedMonths.map(month => ({
        month,
        amount: monthlyChart[month]
      }));

      const monthlyFrequencyArray = sortedMonths.map(month => ({
        month,
        count: monthlyFrequency[month]
      }));

      return res.status(200).json({
        success: true,
        stats: {
          totalDonated: totalDonated,
          contributionsCount: contributionsCount,
          failedCount,
          pendingCount,
          recurringCount,
          oneTimeCount,
          lastDonationAmount: latestDonation ? latestDonation.amount : 0,
          lastDonationDate: latestDonation ? latestDonation.createdAt : null
        },
        categoryBreakdown,
        monthlyChart: monthlyChartArray,
        monthlyFrequency: monthlyFrequencyArray,
        recentDonations: successfulDonations.slice(0, 10)
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user specific donations with cursor pagination
   */
  async getDonations(req, res, next) {
    try {
      const uid = req.user.uid;
      const { page = 1, limit = 10, status, category, type } = req.query;

      // 1. Fetch all user donations (Avoids composite index requirement)
      const dataSnap = await db.collection('donations')
        .where('userId', '==', uid)
        .get();

      let docs = [];
      dataSnap.forEach(d => docs.push({ id: d.id, ...d.data() }));

      // 2. Filter in-memory
      if (status) docs = docs.filter(d => d.status === status);
      if (category) docs = docs.filter(d => d.category === category);
      if (type) docs = docs.filter(d => d.donationType === type);

      // 3. Sort by createdAt desc
      docs.sort((a, b) => {
        const tA = a.createdAt ? (a.createdAt._seconds ? a.createdAt._seconds * 1000 : a.createdAt.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime()) : 0;
        const tB = b.createdAt ? (b.createdAt._seconds ? b.createdAt._seconds * 1000 : b.createdAt.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime()) : 0;
        return tB - tA;
      });

      const totalCount = docs.length;

      // 4. Paginate
      const limitVal = parseInt(limit);
      const pageVal = parseInt(page);
      const offset = (pageVal - 1) * limitVal;

      const paginatedDocs = docs.slice(offset, offset + limitVal);

      return res.status(200).json({
        success: true,
        donations: paginatedDocs,
        total: totalCount,
        page: pageVal,
        hasMore: totalCount > pageVal * limitVal
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Fetch secure signed URL for receipt
   */
  async getReceiptUrl(req, res, next) {
    try {
      const uid = req.user.uid;
      const { donationId } = req.params;

      const donationDoc = await db.collection('donations').doc(donationId).get();
      if (!donationDoc.exists) {
        // Fallback check: query by payment ID
        const testSnap = await db.collection('donations').where('donationId', '==', donationId).limit(1).get();
        if (testSnap.empty) {
          return res.status(404).json({ error: 'Donation record not found' });
        }
        var donationData = testSnap.docs[0].data();
      } else {
        var donationData = donationDoc.data();
      }

      // Enforce security check: donor UID must match authenticated UID (unless they are admin)
      if (donationData.userId !== uid && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: You are not authorized to view this receipt' });
      }

      if (!donationData.receiptUrl) {
        return res.status(404).json({ error: 'Receipt file not yet generated for this donation' });
      }

      // Extract storage path: receipts/{year}/{uid}/{receiptNumber}.pdf
      const year = new Date(donationData.createdAt._seconds ? donationData.createdAt._seconds * 1000 : donationData.createdAt).getFullYear();
      const receiptPath = `receipts/${year}/${donationData.userId}/${donationData.receiptNumber}.pdf`;

      // Generate secure 1-hour URL
      const signedUrl = await receiptService.getSignedReceiptUrl(receiptPath);

      return res.status(200).json({
        success: true,
        receiptUrl: signedUrl
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update user email
   */
  async changeEmail(req, res, next) {
    try {
      const uid = req.user.uid;
      const { newEmail } = req.body;

      // 1. Update in Firebase Authentication (only if real Firebase user)
      if (uid && !uid.startsWith('local-')) {
        try {
          await auth.updateUser(uid, { email: newEmail });
        } catch (authError) {
          console.warn(`⚠️ Failed to sync email in Firebase Auth: ${authError.message}`);
        }
      }

      // 2. Update in Firestore
      await db.collection('users').doc(uid).update({
        email: newEmail.toLowerCase(),
        updatedAt: admin.firestore.Timestamp.fromDate(new Date())
      });

      return res.status(200).json({
        success: true,
        message: 'Email updated successfully. Please verify your new address.'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Soft Delete User Account
   */
  async deleteAccount(req, res, next) {
    try {
      const uid = req.user.uid;
      const { reason = 'Not specified' } = req.body;

      // 1. Soft delete in Firestore (set isActive = false)
      await db.collection('users').doc(uid).update({
        isActive: false,
        deletionReason: reason,
        updatedAt: admin.firestore.Timestamp.fromDate(new Date())
      });

      // 2. Disable user account in Firebase Auth (only if real Firebase user)
      if (uid && !uid.startsWith('local-')) {
        try {
          await auth.updateUser(uid, { disabled: true });
        } catch (authError) {
          console.warn(`⚠️ Failed to disable user in Firebase Auth: ${authError.message}`);
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Your account has been deactivated and disabled'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
