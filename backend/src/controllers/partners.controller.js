const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const partnersController = {
  /**
   * Public: List all active partners sorted by custom display order weightage
   */
  async listPartners(req, res, next) {
    try {
      const { type, featured } = req.query;

      let queryRef = db.collection('partners').where('isActive', '==', true);

      if (type) queryRef = queryRef.where('type', '==', type);
      if (featured === 'true') queryRef = queryRef.where('isFeatured', '==', true);

      queryRef = queryRef.orderBy('displayOrder', 'asc');

      const snap = await queryRef.get();
      const partners = [];
      snap.forEach(doc => {
        partners.push({ id: doc.id, ...doc.data() });
      });

      return res.status(200).json({
        success: true,
        partners
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Public: Retrieve details for a partner by slug
   */
  async getPartnerBySlug(req, res, next) {
    try {
      const { slug } = req.params;

      const snap = await db.collection('partners')
        .where('slug', '==', slug)
        .limit(1)
        .get();

      if (snap.empty) {
        return res.status(404).json({ error: 'Partner not found' });
      }

      const doc = snap.docs[0];
      return res.status(200).json({
        success: true,
        partner: { id: doc.id, ...doc.data() }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Create a new partnership profile
   */
  async createPartner(req, res, next) {
    try {
      const { name, type, description, shortBio = '', logoUrl = '', coverImageUrl = '', website = '', contactEmail = '', contactPhone = '', location = { address: '', city: '', state: '', country: 'India' }, servicesOffered = [], teamMembers = [], isFeatured = false, displayOrder = 10, socialLinks = { linkedin: '', twitter: '', facebook: '', instagram: '' } } = req.body;

      const slug = slugify(name);
      
      const existingSnap = await db.collection('partners').where('slug', '==', slug).limit(1).get();
      let uniqueSlug = slug;
      if (!existingSnap.empty) {
        uniqueSlug = `${slug}-${Date.now().toString().slice(-4)}`;
      }

      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      const partnerRef = db.collection('partners').doc();

      const newPartner = {
        partnerId: partnerRef.id,
        name,
        slug: uniqueSlug,
        type, // "hospital" | "corporate" | "ngo" | "government" | "educational"
        description,
        shortBio: shortBio || description.slice(0, 100) + '...',
        logoUrl,
        coverImageUrl,
        website,
        contactEmail,
        contactPhone,
        location,
        servicesOffered,
        teamMembers,
        isFeatured,
        isActive: true,
        partnershipStartDate: timestamp,
        displayOrder: Number(displayOrder),
        socialLinks,
        createdBy: req.user.uid,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      await partnerRef.set(newPartner);

      return res.status(201).json({
        success: true,
        message: 'Partnership profile created successfully',
        partner: newPartner
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Edit partnership details
   */
  async updatePartner(req, res, next) {
    try {
      const { partnerId } = req.params;
      const updates = { ...req.body };

      const partnerRef = db.collection('partners').doc(partnerId);
      const doc = await partnerRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Partner profile not found' });
      }

      if (updates.name && updates.name !== doc.data().name) {
        updates.slug = slugify(updates.name);
      }

      updates.updatedAt = admin.firestore.Timestamp.fromDate(new Date());

      await partnerRef.update(updates);

      const finalDoc = await partnerRef.get();
      return res.status(200).json({
        success: true,
        message: 'Partnership profile updated successfully',
        partner: finalDoc.data()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Soft delete partner profile
   */
  async deletePartner(req, res, next) {
    try {
      const { partnerId } = req.params;

      const partnerRef = db.collection('partners').doc(partnerId);
      const doc = await partnerRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Partner profile not found' });
      }

      await partnerRef.update({
        isActive: false,
        updatedAt: admin.firestore.Timestamp.fromDate(new Date())
      });

      return res.status(200).json({
        success: true,
        message: 'Partner profile deactivated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = partnersController;
