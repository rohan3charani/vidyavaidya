const express = require('express');
const adminController = require('../controllers/admin.controller');
const communityController = require('../controllers/community.controller');
const adminProfileController = require('../controllers/admin-profile.controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Enforce both general login authentication and specific admin claims on all admin paths
router.use(authMiddleware);
router.use(adminMiddleware);

// ── Admin Profile ─────────────────────────────────────────────────────────────
router.get('/profile', adminProfileController.getProfile);
router.put('/profile', adminProfileController.updateProfile);
router.put('/profile/change-password', adminProfileController.changePassword);

// ── Overview & Donations ──────────────────────────────────────────────────────
router.get('/overview', adminController.getOverview);

router.get('/donations', adminController.getDonations);
router.get('/donations/:donationId', adminController.getDonationById);
router.put('/donations/:donationId/status', adminController.updateDonationStatus);

router.get('/users', adminController.getUsers);
router.put('/users/:uid/status', adminController.updateUserStatus);

router.get('/contacts', adminController.getContacts);
router.put('/contacts/:contactId', adminController.updateContactStatus);

router.get('/applications', adminController.getApplications);
router.put('/applications/:applicationId', communityController.reviewApplication);

router.post('/settings', adminController.updateSettings);

router.get('/export/donations', adminController.exportDonationsCsv);

module.exports = router;

