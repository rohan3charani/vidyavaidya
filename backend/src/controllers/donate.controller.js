const { db } = require('../config/firebase');

const donateController = {
  /**
   * Retrieve active global donation preferences and categories
   */
  async getSettings(req, res, next) {
    try {
      const doc = await db.collection('admin_settings').doc('global').get();
      
      if (!doc.exists) {
        // Safe production fallback values so frontend components render without error
        const defaultSettings = {
          siteName: 'Vidyavaidya Foundation',
          contactEmail: 'info@vidyavaidya.org',
          contactPhone: '+919876543210',
          address: 'Nellore, Andhra Pradesh, India',
          donationCategories: [
            {
              id: 'Education',
              label: 'Education Support',
              icon: 'GraduationCap',
              options: [
                { amount: 1000, tag: 'Study Kit' },
                { amount: 3000, tag: 'School Uniforms' },
                { amount: 6000, tag: 'Annual Tuition Fees' }
              ]
            },
            {
              id: 'Healthcare',
              label: 'Healthcare Support',
              icon: 'Heart',
              options: [
                { amount: 1500, tag: 'Medicine Pack' },
                { amount: 5000, tag: 'Diagnostic Screening' },
                { amount: 12000, tag: 'Critical Surgery Fund' }
              ]
            },
            {
              id: 'Community',
              label: 'Community Development',
              icon: 'Users',
              options: [
                { amount: 500, tag: 'Weekly Hot Meals' },
                { amount: 2500, tag: 'Sanitation Utilities' },
                { amount: 7500, tag: 'Youth Vocational Training' }
              ]
            }
          ],
          monthlyPlans: [500, 1000, 2000, 5000],
          donationDurations: [3, 6, 12],
          razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_stubkeyid',
          fcraEnabled: false,
          maintenanceMode: false,
          socialLinks: {
            facebook: 'https://facebook.com/vidyavaidya',
            instagram: 'https://instagram.com/vidyavaidya',
            twitter: 'https://twitter.com/vidyavaidya',
            linkedin: 'https://linkedin.com/company/vidyavaidya'
          },
          stats: {
            totalRaised: 854300,
            totalDonors: 320,
            totalBeneficiaries: 1800,
            totalEvents: 24
          }
        };
        return res.status(200).json({ success: true, settings: defaultSettings });
      }

      return res.status(200).json({ success: true, settings: doc.data() });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = donateController;
