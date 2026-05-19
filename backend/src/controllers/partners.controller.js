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

      const snap = await queryRef.get();
      const partners = [];
      snap.forEach(doc => {
        partners.push({ id: doc.id, ...doc.data() });
      });

      // Sort in-memory to avoid requiring composite indexes
      partners.sort((a, b) => {
        const orderA = a.displayOrder !== undefined ? Number(a.displayOrder) : 10;
        const orderB = b.displayOrder !== undefined ? Number(b.displayOrder) : 10;
        return orderA - orderB;
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
      const {
        name,
        type,
        description,
        shortBio = '',
        logoUrl = '',
        coverImageUrl = '',
        website = '',
        websiteUrl = '', // fallback
        contactEmail = '',
        contactPhone = '',
        location,
        address = '',
        city = '',
        state = '',
        country = 'India',
        servicesOffered = [],
        teamMembers = [],
        isFeatured = false,
        displayOrder = 10,
        socialLinks,
        linkedinUrl = '',
        twitterUrl = '',
        facebookUrl = '',
        instagramUrl = '',
        partnershipStartDate,
        supportQuote = '',
        supportQuoteAuthor = '',
        galleryUrls = [],
        galleryImages = []
      } = req.body;

      const finalLocation = location || {
        address: address || '',
        city: city || '',
        state: state || '',
        country: country || 'India'
      };

      const finalSocialLinks = socialLinks || {
        linkedin: linkedinUrl || '',
        twitter: twitterUrl || '',
        facebook: facebookUrl || '',
        instagram: instagramUrl || ''
      };

      const finalWebsite = website || websiteUrl || '';
      const finalGalleryUrls = (galleryUrls && galleryUrls.length > 0) ? galleryUrls : (galleryImages || []);

      const slug = slugify(name);
      
      const existingSnap = await db.collection('partners').where('slug', '==', slug).limit(1).get();
      let uniqueSlug = slug;
      if (!existingSnap.empty) {
        uniqueSlug = `${slug}-${Date.now().toString().slice(-4)}`;
      }

      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      let parsedStartDate = timestamp;
      if (partnershipStartDate) {
        const parsed = new Date(partnershipStartDate);
        if (!isNaN(parsed.getTime())) {
          parsedStartDate = admin.firestore.Timestamp.fromDate(parsed);
        }
      }

      const partnerRef = db.collection('partners').doc();

      const newPartner = {
        partnerId: partnerRef.id,
        name,
        slug: uniqueSlug,
        type: type || 'hospital', // "hospital" | "corporate" | "ngo" | "government" | "educational"
        description: description || shortBio || '',
        shortBio: shortBio || (description ? description.slice(0, 100) + '...' : ''),
        logoUrl,
        coverImageUrl,
        website: finalWebsite,
        contactEmail,
        contactPhone,
        location: finalLocation,
        servicesOffered,
        teamMembers,
        isFeatured: !!isFeatured,
        isActive: true,
        partnershipStartDate: parsedStartDate,
        displayOrder: Number(displayOrder),
        socialLinks: finalSocialLinks,
        supportQuote: supportQuote || '',
        supportQuoteAuthor: supportQuoteAuthor || '',
        galleryUrls: finalGalleryUrls,
        createdBy: (req.user && req.user.uid) || 'admin',
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

      // Convert flat fields to nested structures if present
      if (updates.websiteUrl !== undefined && updates.website === undefined) {
        updates.website = updates.websiteUrl;
        delete updates.websiteUrl;
      }

      if (updates.galleryImages !== undefined && updates.galleryUrls === undefined) {
        updates.galleryUrls = updates.galleryImages;
        delete updates.galleryImages;
      }

      // Map location fields
      const hasLocationFields = updates.address !== undefined || updates.city !== undefined || updates.state !== undefined || updates.country !== undefined;
      if (hasLocationFields && !updates.location) {
        const existingLocation = doc.data().location || { address: '', city: '', state: '', country: 'India' };
        updates.location = {
          address: updates.address !== undefined ? updates.address : existingLocation.address,
          city: updates.city !== undefined ? updates.city : existingLocation.city,
          state: updates.state !== undefined ? updates.state : existingLocation.state,
          country: updates.country !== undefined ? updates.country : existingLocation.country
        };
        delete updates.address;
        delete updates.city;
        delete updates.state;
        delete updates.country;
      }

      // Map social link fields
      const hasSocialFields = updates.linkedinUrl !== undefined || updates.twitterUrl !== undefined || updates.facebookUrl !== undefined || updates.instagramUrl !== undefined;
      if (hasSocialFields && !updates.socialLinks) {
        const existingSocial = doc.data().socialLinks || { linkedin: '', twitter: '', facebook: '', instagram: '' };
        updates.socialLinks = {
          linkedin: updates.linkedinUrl !== undefined ? updates.linkedinUrl : existingSocial.linkedin,
          twitter: updates.twitterUrl !== undefined ? updates.twitterUrl : existingSocial.twitter,
          facebook: updates.facebookUrl !== undefined ? updates.facebookUrl : existingSocial.facebook,
          instagram: updates.instagramUrl !== undefined ? updates.instagramUrl : existingSocial.instagram
        };
        delete updates.linkedinUrl;
        delete updates.twitterUrl;
        delete updates.facebookUrl;
        delete updates.instagramUrl;
      }

      if (updates.partnershipStartDate) {
        const parsed = new Date(updates.partnershipStartDate);
        if (!isNaN(parsed.getTime())) {
          updates.partnershipStartDate = admin.firestore.Timestamp.fromDate(parsed);
        } else {
          delete updates.partnershipStartDate;
        }
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
