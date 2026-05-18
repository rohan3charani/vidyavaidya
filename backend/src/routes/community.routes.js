const express = require('express');
const communityController = require('../controllers/community.controller');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { applySchema } = require('../schemas/community.schema');

const router = express.Router();

// All community applicant routes are protected by authMiddleware
router.use(authMiddleware);

router.post('/apply', validate(applySchema), communityController.apply);
router.get('/my-applications', communityController.getMyApplications);
router.get('/application/:applicationId', communityController.getApplicationById);

module.exports = router;
