const { db } = require('../config/firebase');
const admin = require('firebase-admin');
const emailService = require('../services/email.service');

const sanitizeInput = (text) => {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').trim(); // Remove basic HTML tags to avoid XSS injections
};

const contactController = {
  /**
   * Public: Log new contact form submission and dispatch alerts
   */
  async submitContact(req, res, next) {
    try {
      const { name, email, phone, subject, message, queryType } = req.body;

      const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      // 1. Sanitize text inputs
      const cleanName = sanitizeInput(name);
      const cleanSubject = sanitizeInput(subject);
      const cleanMessage = sanitizeInput(message);

      // 2. Initialize the Firestore document
      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      const contactRef = db.collection('contacts').doc();
      
      const newContact = {
        contactId: contactRef.id,
        name: cleanName,
        email: email.toLowerCase().trim(),
        phone: phone || '',
        subject: cleanSubject,
        message: cleanMessage,
        queryType, // "General Inquiry" | "Donation Process" | "Tax Benefits (FCRA)" | "Partnership" | "Volunteer Abroad" | "Other"
        status: 'new',
        assignedTo: '',
        adminNotes: '',
        ipAddress,
        userAgent,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      await contactRef.set(newContact);

      // 3. Dispatch confirmation/notification emails asynchronously
      emailService.sendContactSubmissionEmails(newContact).catch(err => {
        console.error('Contact emails dispatch warning:', err.message);
      });

      return res.status(201).json({
        success: true,
        message: "Your inquiry has been logged. We will respond within 2-3 business days."
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Public: Log a specialized international/FCRA tax inquiry
   */
  async submitForeignInquiry(req, res, next) {
    try {
      const { name, email, phone, message, country, donationIntent, organizationName } = req.body;

      const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      // 1. Sanitize inputs
      const cleanName = sanitizeInput(name);
      const cleanMessage = sanitizeInput(message);
      const cleanCountry = sanitizeInput(country);
      const cleanIntent = sanitizeInput(donationIntent);
      const cleanOrg = sanitizeInput(organizationName || '');

      // 2. Formulate specialized FCRA inquiry ticket
      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      const contactRef = db.collection('contacts').doc();

      const newContact = {
        contactId: contactRef.id,
        name: cleanName,
        email: email.toLowerCase().trim(),
        phone: phone || '',
        subject: `FCRA/Foreign Donation Inquiry from ${cleanCountry}`,
        message: `Country: ${cleanCountry}\nDonation Intent: ${cleanIntent}\nOrganization: ${cleanOrg}\n\nMessage:\n${cleanMessage}`,
        queryType: 'Tax Benefits (FCRA)',
        status: 'new',
        assignedTo: '',
        adminNotes: '',
        ipAddress,
        userAgent,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      await contactRef.set(newContact);

      // 3. Email notifications
      emailService.sendContactSubmissionEmails(newContact).catch(err => {
        console.error('FCRA inquiry emails warning:', err.message);
      });

      return res.status(201).json({
        success: true,
        message: 'Your FCRA donation inquiry has been logged. Our FCRA compliance team will contact you.'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = contactController;
