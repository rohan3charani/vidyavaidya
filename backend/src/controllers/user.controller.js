const { auth, db } = require('../config/firebase');
const receiptService = require('../services/receipt.service');
const admin = require('firebase-admin');
const { encrypt } = require('../services/encryption.service');

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
      return res.status(200).json({ success: true, profile: doc.data() });
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
      const { fullName, phone, address, isAlumni, alumniId, yearOfGraduation, pan } = req.body;

      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User profile not found' });
      }

      const updates = {};
      if (fullName) {
        updates.fullName = fullName;
        // Synchronize display name in Firebase Auth
        await auth.updateUser(uid, { displayName: fullName });
      }
      if (phone) updates.phone = phone;
      if (address) updates.address = address;
      if (isAlumni !== undefined) updates.isAlumni = isAlumni;
      if (alumniId) updates.alumniId = alumniId;
      if (yearOfGraduation) updates.yearOfGraduation = Number(yearOfGraduation);
      
      // Encrypt PAN card if provided
      if (pan) {
        updates.pan = encrypt(pan);
      }

      updates.profileComplete = true;
      updates.updatedAt = admin.firestore.Timestamp.fromDate(new Date());

      await userRef.update(updates);

      const finalDoc = await userRef.get();
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        profile: finalDoc.data()
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

      // 1. Fetch user doc for basic total stats
      const userDoc = await db.collection('users').doc(uid).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User profile not found' });
      }
      const userData = userDoc.data();

      // 2. Fetch recent successful donations
      const donationsSnap = await db.collection('donations')
        .where('userId', '==', uid)
        .where('status', '==', 'successful')
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();

      const donations = [];
      let categoryBreakdown = { Education: 0, Healthcare: 0, Community: 0 };
      let monthlyChart = {};

      donationsSnap.forEach(doc => {
        const data = doc.data();
        donations.push(data);

        // Aggregate categories
        if (data.category && categoryBreakdown[data.category] !== undefined) {
          categoryBreakdown[data.category] += data.amount;
        }

        // Aggregate monthly stats (past 6 months)
        const date = data.createdAt ? new Date(data.createdAt._seconds ? data.createdAt._seconds * 1000 : data.createdAt) : new Date();
        const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        monthlyChart[monthYear] = (monthlyChart[monthYear] || 0) + data.amount;
      });

      // Format monthly chart as array
      const monthlyChartArray = Object.keys(monthlyChart).map(month => ({
        month,
        amount: monthlyChart[month]
      })).slice(0, 6).reverse();

      const latestDonation = donations.length > 0 ? donations[0] : null;

      return res.status(200).json({
        success: true,
        stats: {
          totalDonated: userData.totalDonated || 0,
          donationCount: userData.donationCount || 0,
          lastDonationAmount: latestDonation ? latestDonation.amount : 0,
          lastDonationDate: latestDonation ? latestDonation.createdAt : null
        },
        categoryBreakdown,
        monthlyChart: monthlyChartArray,
        recentDonations: donations
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

      let queryRef = db.collection('donations').where('userId', '==', uid);

      if (status) queryRef = queryRef.where('status', '==', status);
      if (category) queryRef = queryRef.where('category', '==', category);
      if (type) queryRef = queryRef.where('donationType', '==', type);

      queryRef = queryRef.orderBy('createdAt', 'desc');

      const countSnap = await queryRef.get();
      const totalCount = countSnap.size;

      // Simple offset-based logic using snapshot array for compatibility, 
      // but keeping it performant for user-tier records.
      const limitVal = parseInt(limit);
      const pageVal = parseInt(page);
      const offset = (pageVal - 1) * limitVal;

      const dataSnap = await queryRef.limit(limitVal + offset).get();
      const docs = [];
      dataSnap.forEach(d => docs.push({ id: d.id, ...d.data() }));

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

      // 1. Update in Firebase Authentication
      await auth.updateUser(uid, { email: newEmail });

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

      // 2. Disable user account in Firebase Auth
      await auth.updateUser(uid, { disabled: true });

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
