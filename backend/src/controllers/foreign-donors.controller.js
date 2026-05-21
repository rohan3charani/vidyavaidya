const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const sanitizeInput = (text) => {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').trim();
};

const foreignDonorsController = {
  /**
   * Public: Submit a new Foreign Donor Inquiry/Registration
   */
  async createDonor(req, res, next) {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        country,
        organization,
        queryType,
        donationIntent,
        message
      } = req.body;

      if (!firstName || !lastName || !email || !phone || !country || !queryType || !donationIntent || !message) {
        return res.status(400).json({ error: 'All required fields must be provided' });
      }

      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      const donorRef = db.collection('foreign_donors').doc();

      const newDonor = {
        id: donorRef.id,
        firstName: sanitizeInput(firstName),
        lastName: sanitizeInput(lastName),
        email: email.toLowerCase().trim(),
        phone: sanitizeInput(phone),
        country: sanitizeInput(country),
        organization: sanitizeInput(organization || ''),
        queryType: sanitizeInput(queryType),
        donationIntent: sanitizeInput(donationIntent),
        message: sanitizeInput(message),
        status: 'Pending', // Pending, Approved, Rejected
        createdAt: timestamp,
        updatedAt: timestamp
      };

      await donorRef.set(newDonor);

      return res.status(201).json({
        success: true,
        message: 'Your Foreign Donor inquiry has been submitted successfully. We will get back to you soon!',
        donor: newDonor
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: List all Foreign Donors with in-memory filters, sorting, and search
   */
  async listDonors(req, res, next) {
    try {
      const snap = await db.collection('foreign_donors').get();
      const donors = [];
      snap.forEach(doc => {
        donors.push({ id: doc.id, ...doc.data() });
      });

      // Sort by default: latest first
      donors.sort((a, b) => {
        const aTime = a.createdAt?._seconds || (a.createdAt ? new Date(a.createdAt).getTime() / 1000 : 0);
        const bTime = b.createdAt?._seconds || (b.createdAt ? new Date(b.createdAt).getTime() / 1000 : 0);
        return bTime - aTime;
      });

      return res.status(200).json({
        success: true,
        donors
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Update status of a Foreign Donor registration
   */
  async updateDonorStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      const donorRef = db.collection('foreign_donors').doc(id);
      const doc = await donorRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'Foreign donor record not found' });
      }

      await donorRef.update({
        status,
        updatedAt: admin.firestore.Timestamp.fromDate(new Date())
      });

      const updatedDoc = await donorRef.get();

      return res.status(200).json({
        success: true,
        message: `Donor status updated to ${status}`,
        donor: updatedDoc.data()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Delete a Foreign Donor registration
   */
  async deleteDonor(req, res, next) {
    try {
      const { id } = req.params;

      const donorRef = db.collection('foreign_donors').doc(id);
      const doc = await donorRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'Foreign donor record not found' });
      }

      await donorRef.delete();
 
       return res.status(200).json({
         success: true,
         message: 'Foreign donor record deleted successfully'
       });
     } catch (error) {
       next(error);
     }
   },

  /**
   * Admin-Only: Respond to a Foreign Donor query and send email
   */
  async respondDonor(req, res, next) {
    try {
      const { id } = req.params;
      const { adminResponse, status } = req.body;

      if (!adminResponse || !adminResponse.trim()) {
        return res.status(400).json({ error: 'Response message must be provided' });
      }

      const donorRef = db.collection('foreign_donors').doc(id);
      const doc = await donorRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'Foreign donor record not found' });
      }

      const donorData = doc.data();

      // Update in Firestore
      const updateData = {
        adminResponse: sanitizeInput(adminResponse),
        status: status || 'Solved',
        repliedAt: admin.firestore.Timestamp.fromDate(new Date()),
        updatedAt: admin.firestore.Timestamp.fromDate(new Date())
      };

      await donorRef.update(updateData);

      // Import email service dynamically
      const emailService = require('../services/email.service');
      
      // Send the email response
      await emailService.sendForeignDonorResponseEmail(
        donorData.email,
        donorData.firstName,
        donorData.lastName,
        donorData.queryType,
        donorData.message,
        updateData.adminResponse
      );

      return res.status(200).json({
        success: true,
        message: 'Response submitted and email sent to donor successfully',
        donor: {
          ...donorData,
          ...updateData
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = foreignDonorsController;
