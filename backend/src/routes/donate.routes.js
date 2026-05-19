const express = require('express');
const donateController = require('../controllers/donate.controller');

const router = express.Router();

// Retrieve global donation preferences, categories, and public key
router.get('/settings', donateController.getSettings);

module.exports = router;
