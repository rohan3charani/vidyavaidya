const { db, auth } = require('../config/firebase');
const admin = require('firebase-admin');
const emailService = require('../services/email.service');

const communityController = {
  /**
   * Protected: Apply to join community (Volunteer, Hospital, Corporate, Donor)
   */
  async apply(req, res, next) {
    try {
      const uid = req.user.uid;
      const { type, volunteerDetails, corporateDetails, hospitalDetails } = req.body;

      // 1. Double check: check if user already has a pending application for this category
      const existingSnap = await db.collection('community_applications')
        .where('userId', '==', uid)
        .where('type', '==', type)
        .where('status', 'in', ['pending', 'under_review'])
        .limit(1)
        .get();

      if (!existingSnap.empty) {
        return res.status(409).json({ error: `You already have an active, pending application for: ${type}` });
      }

      // 2. Fetch user details to populate basic metadata fields
      const userDoc = await db.collection('users').doc(uid).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User profile not found' });
      }

      const user = userDoc.data();
      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      const appRef = db.collection('community_applications').doc();

      // 3. Assemble application details
      const newApplication = {
        applicationId: appRef.id,
        userId: uid,
        applicantName: user.fullName || 'Generous Supporter',
        applicantEmail: user.email,
        applicantPhone: user.phone || '',
        type, // "volunteer" | "donor" | "corporate" | "hospital"
        status: 'pending',
        volunteerDetails: type === 'volunteer' ? volunteerDetails : null,
        corporateDetails: type === 'corporate' ? corporateDetails : null,
        hospitalDetails: type === 'hospital' ? hospitalDetails : null,
        adminNotes: '',
        reviewedBy: '',
        reviewedAt: null,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      await appRef.set(newApplication);

      // 4. Dispatch notification emails asynchronously
      emailService.sendCommunityApplicationReceivedEmail(newApplication).catch(err => {
        console.error('Community emails error:', err.message);
      });

      return res.status(201).json({
        success: true,
        applicationId: appRef.id,
        status: 'pending',
        message: 'Your community application has been successfully submitted and is under review.'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Protected: Get currently authenticated user's applications
   */
  async getMyApplications(req, res, next) {
    try {
      const uid = req.user.uid;
      const snap = await db.collection('community_applications')
        .where('userId', '==', uid)
        .orderBy('createdAt', 'desc')
        .get();

      const list = [];
      snap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });

      return res.status(200).json({
        success: true,
        applications: list
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Protected: Get a single application, checking ownership
   */
  async getApplicationById(req, res, next) {
    try {
      const uid = req.user.uid;
      const { applicationId } = req.params;

      const doc = await db.collection('community_applications').doc(applicationId).get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Application not found' });
      }

      const data = doc.data();
      if (data.userId !== uid && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      return res.status(200).json({ success: true, application: data });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Process Application (Approve or Reject)
   */
  async reviewApplication(req, res, next) {
    try {
      const adminUid = req.user.uid;
      const { applicationId } = req.params;
      const { status, adminNotes } = req.body; // "approved" | "rejected"

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Status must be approved or rejected' });
      }

      const appRef = db.collection('community_applications').doc(applicationId);
      const appSnap = await appRef.get();
      if (!appSnap.exists) {
        return res.status(404).json({ error: 'Application not found' });
      }

      const application = appSnap.data();
      if (application.status === 'approved' || application.status === 'rejected') {
        return res.status(400).json({ error: 'This application has already been processed' });
      }

      const timestamp = admin.firestore.Timestamp.fromDate(new Date());

      // 1. If approved, upgrade target user claims and role in Firestore
      if (status === 'approved') {
        const targetUserId = application.userId;
        const userRef = db.collection('users').doc(targetUserId);
        
        // Define updated role based on application type
        let newRole = 'donor'; // default fallback
        if (application.type === 'volunteer') newRole = 'volunteer';
        if (application.type === 'hospital') newRole = 'hospital';
        if (application.type === 'corporate') newRole = 'corporate';

        // Apply claims in Firebase Auth
        await auth.setCustomUserClaims(targetUserId, {
          role: newRole,
          communityMember: true
        }).catch(err => {
          console.warn(`Could not set custom claims on auth user (continuing):`, err.message);
        });

        // Update Firestore profile
        await userRef.update({
          role: newRole,
          updatedAt: timestamp
        });
      }

      // 2. Save final application review status in Firestore
      const updatedApp = {
        ...application,
        status,
        adminNotes: adminNotes || '',
        reviewedBy: adminUid,
        reviewedAt: timestamp,
        updatedAt: timestamp
      };

      await appRef.set(updatedApp);

      // 3. Dispatch status notification email to applicant
      emailService.sendCommunityApplicationStatusEmail(updatedApp).catch(err => {
        console.error('Status notification email error:', err.message);
      });

      return res.status(200).json({
        success: true,
        message: `Application successfully updated to: ${status}`,
        application: updatedApp
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = communityController;
