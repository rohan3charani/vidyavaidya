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

const volunteersController = {
  /**
   * Public: List all active volunteers
   */
  async listVolunteers(req, res, next) {
    try {
      const { all } = req.query;

      let queryRef = db.collection('partners').where('type', '==', 'government');
      
      if (all !== 'true') {
        queryRef = queryRef.where('isActive', '==', true);
      }

      const snap = await queryRef.get();
      const volunteers = [];
      snap.forEach(doc => {
        volunteers.push({ id: doc.id, ...doc.data() });
      });

      // Sort in-memory to keep custom display order (defaulting to weight 10)
      volunteers.sort((a, b) => {
        const orderA = a.displayOrder !== undefined ? Number(a.displayOrder) : 10;
        const orderB = b.displayOrder !== undefined ? Number(b.displayOrder) : 10;
        return orderA - orderB;
      });

      return res.status(200).json({
        success: true,
        partners: volunteers // using 'partners' or 'volunteers'? Let's return both for safety/compatibility
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Create a new volunteer
   */
  async createVolunteer(req, res, next) {
    try {
      const {
        name,
        logoUrl = '',
        isActive = true,
        displayOrder = 10
      } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Volunteer Name is required' });
      }

      const slug = slugify(name);
      
      const existingSnap = await db.collection('partners').where('slug', '==', slug).limit(1).get();
      let uniqueSlug = slug;
      if (!existingSnap.empty) {
        uniqueSlug = `${slug}-${Date.now().toString().slice(-4)}`;
      }

      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      const volunteerRef = db.collection('partners').doc();

      const newVolunteer = {
        partnerId: volunteerRef.id,
        name,
        slug: uniqueSlug,
        type: 'government', // Force "government" as this corresponds to Volunteer Network
        description: '',
        shortBio: '',
        logoUrl,
        coverImageUrl: '',
        website: '',
        contactEmail: '',
        contactPhone: '',
        location: {
          address: '',
          city: '',
          state: '',
          country: 'India'
        },
        servicesOffered: [],
        teamMembers: [],
        isFeatured: false,
        isActive: !!isActive,
        partnershipStartDate: timestamp,
        displayOrder: Number(displayOrder),
        socialLinks: {
          linkedin: '',
          twitter: '',
          facebook: '',
          instagram: ''
        },
        supportQuote: '',
        supportQuoteAuthor: '',
        galleryUrls: [],
        createdBy: (req.user && req.user.uid) || 'admin',
        createdAt: timestamp,
        updatedAt: timestamp
      };

      await volunteerRef.set(newVolunteer);

      return res.status(201).json({
        success: true,
        message: 'Volunteer profile created successfully',
        partner: newVolunteer
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Update volunteer details
   */
  async updateVolunteer(req, res, next) {
    try {
      const { volunteerId } = req.params;
      const updates = { ...req.body };

      let volunteerRef = db.collection('partners').doc(volunteerId);
      let doc = await volunteerRef.get();

      // Fallback lookup by partnerId property
      if (!doc.exists) {
        const snap = await db.collection('partners')
          .where('partnerId', '==', volunteerId)
          .limit(1)
          .get();
        if (!snap.empty) {
          volunteerRef = snap.docs[0].ref;
          doc = snap.docs[0];
        } else {
          return res.status(404).json({ error: 'Volunteer profile not found' });
        }
      }

      // Check if it's actually a volunteer profile
      if (doc.data().type !== 'government') {
        return res.status(400).json({ error: 'Selected profile is not a volunteer' });
      }

      if (updates.name && updates.name !== doc.data().name) {
        updates.slug = slugify(updates.name);
      }

      // Force type to remain government
      updates.type = 'government';
      updates.updatedAt = admin.firestore.Timestamp.fromDate(new Date());

      await volunteerRef.update(updates);

      const finalDoc = await volunteerRef.get();
      return res.status(200).json({
        success: true,
        message: 'Volunteer profile updated successfully',
        partner: finalDoc.data()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Delete volunteer profile
   */
  async deleteVolunteer(req, res, next) {
    try {
      const { volunteerId } = req.params;

      let volunteerRef = db.collection('partners').doc(volunteerId);
      let doc = await volunteerRef.get();

      if (!doc.exists) {
        const snap = await db.collection('partners')
          .where('partnerId', '==', volunteerId)
          .limit(1)
          .get();
        if (!snap.empty) {
          volunteerRef = snap.docs[0].ref;
          doc = snap.docs[0];
        } else {
          return res.status(404).json({ error: 'Volunteer profile not found' });
        }
      }

      if (doc.data().type !== 'government') {
        return res.status(400).json({ error: 'Selected profile is not a volunteer' });
      }

      await volunteerRef.delete();

      return res.status(200).json({
        success: true,
        message: 'Volunteer profile deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = volunteersController;
