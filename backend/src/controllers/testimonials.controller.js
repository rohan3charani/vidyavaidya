const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const testimonialsController = {
  /**
   * Public: List testimonials sorted by displayOrder
   */
  async listTestimonials(req, res, next) {
    try {
      const { featured, published, category } = req.query;

      let queryRef = db.collection('testimonials');

      // Filter by published unless admin requested all
      if (published === 'true') {
        queryRef = queryRef.where('isPublished', '==', true);
      } else if (published !== 'all') {
        // Default to listing published testimonials for the public website
        queryRef = queryRef.where('isPublished', '==', true);
      }

      if (featured === 'true') {
        queryRef = queryRef.where('isFeatured', '==', true);
      }

      if (category) {
        queryRef = queryRef.where('category', '==', category);
      }

      const snap = await queryRef.get();
      const testimonials = [];
      snap.forEach(doc => {
        testimonials.push({ id: doc.id, ...doc.data() });
      });

      // Sort in-memory to prevent requiring composite index in firestore if not pre-configured
      testimonials.sort((a, b) => {
        const orderA = a.displayOrder !== undefined ? Number(a.displayOrder) : 10;
        const orderB = b.displayOrder !== undefined ? Number(b.displayOrder) : 10;
        return orderA - orderB;
      });

      return res.status(200).json({
        success: true,
        testimonials
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Create a new testimonial profile
   */
  async createTestimonial(req, res, next) {
    try {
      const {
        name,
        role,
        organization = '',
        location = '',
        headline = '',
        message,
        rating = 5,
        avatarUrl = '',
        coverImageUrl = '',
        isFeatured = false,
        isPublished = true,
        displayOrder = 10,
        category = 'Beneficiary'
      } = req.body;

      if (!name || !message) {
        return res.status(400).json({ error: 'Name and Message are required' });
      }

      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      const testimonialRef = db.collection('testimonials').doc();

      const newTestimonial = {
        testimonialId: testimonialRef.id,
        name,
        role,
        organization,
        location,
        headline,
        message,
        rating: Number(rating),
        avatarUrl,
        coverImageUrl,
        isFeatured: !!isFeatured,
        isPublished: !!isPublished,
        displayOrder: Number(displayOrder),
        category,
        createdBy: (req.user && req.user.uid) || 'admin',
        createdAt: timestamp,
        updatedAt: timestamp
      };

      await testimonialRef.set(newTestimonial);

      return res.status(201).json({
        success: true,
        message: 'Testimonial created successfully',
        testimonial: newTestimonial
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Edit testimonial details
   */
  async updateTestimonial(req, res, next) {
    try {
      const { testimonialId } = req.params;
      const updates = { ...req.body };

      const testimonialRef = db.collection('testimonials').doc(testimonialId);
      const doc = await testimonialRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }

      updates.updatedAt = admin.firestore.Timestamp.fromDate(new Date());
      if (updates.rating !== undefined) updates.rating = Number(updates.rating);
      if (updates.displayOrder !== undefined) updates.displayOrder = Number(updates.displayOrder);

      await testimonialRef.update(updates);

      const finalDoc = await testimonialRef.get();
      return res.status(200).json({
        success: true,
        message: 'Testimonial updated successfully',
        testimonial: finalDoc.data()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Delete testimonial profile
   */
  async deleteTestimonial(req, res, next) {
    try {
      const { testimonialId } = req.params;

      const testimonialRef = db.collection('testimonials').doc(testimonialId);
      const doc = await testimonialRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }

      await testimonialRef.delete();

      return res.status(200).json({
        success: true,
        message: 'Testimonial deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = testimonialsController;
