// CHANGED: F1, F6
// F1  — listEvents() now uses Firestore server-side .where() filters instead of
//       fetching ALL documents and filtering in memory
// F6  — Applied .limit() on Firestore queries to prevent unbounded reads

const { db } = require('../config/firebase');
const admin = require('firebase-admin');
const emailService = require('../services/email.service');

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

const eventsController = {
  /**
   * F1/F6: Public list — server-side Firestore filters instead of in-memory scan.
   * Single-field filters are pushed to Firestore; multi-field combos handled in memory
   * (composite index not required for the common single-filter path).
   */
  async listEvents(req, res, next) {
    try {
      const { page = 1, limit = 50, category, status, featured } = req.query;

      let queryRef = db.collection('events');

      // Apply the most selective single filter directly in Firestore
      if (status && status !== 'all') {
        queryRef = queryRef.where('status', '==', status);
      } else if (category && category !== 'All') {
        queryRef = queryRef.where('category', '==', category);
      } else if (featured === 'true') {
        queryRef = queryRef.where('isFeatured', '==', true);
      }

      // F6: Cap reads — never return more than 500 at once
      const MAX_FETCH = 500;
      queryRef = queryRef.limit(MAX_FETCH);

      const snap = await queryRef.get();
      let events = [];
      snap.forEach(doc => {
        events.push({ id: doc.id, ...doc.data() });
      });

      // Secondary in-memory filters for combinations not covered by the primary Firestore filter
      if (status && status !== 'all' && category && category !== 'All') {
        events = events.filter(e => e.category === category);
      }
      if (status && status !== 'all' && featured === 'true') {
        events = events.filter(e => e.isFeatured === true);
      }
      if (!status && category && category !== 'All' && featured === 'true') {
        events = events.filter(e => e.isFeatured === true);
      }

      // Sort by startDate descending (newest first)
      events.sort((a, b) => {
        const dateA = a.startDate ? (a.startDate._seconds ? a.startDate._seconds * 1000 : new Date(a.startDate).getTime()) : 0;
        const dateB = b.startDate ? (b.startDate._seconds ? b.startDate._seconds * 1000 : new Date(b.startDate).getTime()) : 0;
        return dateB - dateA;
      });

      const total    = events.length;
      const pageVal  = parseInt(page);
      const limitVal = parseInt(limit);
      const offset   = (pageVal - 1) * limitVal;

      const paginatedEvents = events.slice(offset, offset + limitVal);

      return res.status(200).json({
        success: true,
        events:  paginatedEvents,
        total,
        page:    pageVal,
        hasMore: total > pageVal * limitVal
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Public: Retrieve details for a single event by its unique slug
   */
  async getEventBySlug(req, res, next) {
    try {
      const { slug } = req.params;

      const snap = await db.collection('events').where('slug', '==', slug).limit(1).get();

      if (snap.empty) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const eventDoc  = snap.docs[0];
      const eventData = eventDoc.data();

      // Fire-and-forget: increment viewCount
      eventDoc.ref.update({
        viewCount: admin.firestore.FieldValue.increment(1)
      }).catch(err => console.error('Increment viewCount failed:', err.message));

      return res.status(200).json({
        success: true,
        event:   { id: eventDoc.id, ...eventData }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Create a new event
   */
  async createEvent(req, res, next) {
    try {
      const {
        title, description, shortDescription, category,
        status = 'upcoming', thumbnailUrl, galleryUrls = [], galleryImages = [],
        videoUrl = '', location, startDate, endDate, registrationDeadline,
        totalSeats = 100, isFeatured = false, organizer = 'Vidyavaidya Foundation',
        speakers = [], tags = [], eventType = 'photo'
      } = req.body;

      const slug = slugify(title);

      // Verify slug uniqueness
      const existingSnap = await db.collection('events').where('slug', '==', slug).limit(1).get();
      let uniqueSlug = slug;
      if (!existingSnap.empty) {
        uniqueSlug = `${slug}-${Date.now().toString().slice(-4)}`;
      }

      const timestamp = admin.firestore.Timestamp.fromDate(new Date());

      const parseTimestamp = (dateVal) => {
        if (!dateVal) return timestamp;
        const parsed = new Date(dateVal);
        return isNaN(parsed.getTime()) ? timestamp : admin.firestore.Timestamp.fromDate(parsed);
      };

      const finalGalleryUrls = (galleryUrls && galleryUrls.length > 0) ? galleryUrls : (galleryImages || []);

      const eventRef = db.collection('events').doc();

      const newEvent = {
        eventId:              eventRef.id,
        title,
        slug:                 uniqueSlug,
        description:          description || shortDescription || '',
        shortDescription:     shortDescription || (description ? description.slice(0, 150) + '...' : ''),
        category:             category || 'General',
        status,
        thumbnailUrl:         thumbnailUrl || '',
        galleryUrls:          finalGalleryUrls,
        videoUrl,
        location:             location || 'Nellore',
        startDate:            parseTimestamp(startDate),
        endDate:              parseTimestamp(endDate || startDate),
        registrationDeadline: parseTimestamp(registrationDeadline || startDate),
        totalSeats:           Number(totalSeats),
        registeredCount:      0,
        isRegistrationOpen:   true,
        isFeatured:           !!isFeatured,
        organizer,
        speakers,
        tags,
        eventType,
        createdBy:            (req.user && req.user.uid) || 'admin',
        createdAt:            timestamp,
        updatedAt:            timestamp,
        publishedAt:          timestamp
      };

      await eventRef.set(newEvent);

      return res.status(201).json({
        success: true,
        message: 'Event created successfully',
        event:   newEvent
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Update an existing event
   */
  async updateEvent(req, res, next) {
    try {
      const { eventId } = req.params;
      const updates = { ...req.body };

      const eventRef = db.collection('events').doc(eventId);
      const eventDoc = await eventRef.get();
      if (!eventDoc.exists) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (updates.galleryImages !== undefined && updates.galleryUrls === undefined) {
        updates.galleryUrls = updates.galleryImages;
        delete updates.galleryImages;
      }

      if (updates.title && updates.title !== eventDoc.data().title) {
        updates.slug = slugify(updates.title);
      }

      const parseTimestamp = (dateVal) => {
        const parsed = new Date(dateVal);
        return isNaN(parsed.getTime()) ? null : admin.firestore.Timestamp.fromDate(parsed);
      };

      if (updates.startDate) {
        const ts = parseTimestamp(updates.startDate);
        if (ts) updates.startDate = ts;
        else delete updates.startDate;
      }
      if (updates.endDate) {
        const ts = parseTimestamp(updates.endDate);
        if (ts) updates.endDate = ts;
        else delete updates.endDate;
      }
      if (updates.registrationDeadline) {
        const ts = parseTimestamp(updates.registrationDeadline);
        if (ts) updates.registrationDeadline = ts;
        else delete updates.registrationDeadline;
      }
      if (updates.totalSeats !== undefined) {
        updates.totalSeats = Number(updates.totalSeats);
      }

      updates.updatedAt = admin.firestore.Timestamp.fromDate(new Date());

      await eventRef.update(updates);

      const finalDoc = await eventRef.get();
      return res.status(200).json({
        success: true,
        message: 'Event updated successfully',
        event:   finalDoc.data()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Soft delete or cancel an event
   */
  async deleteEvent(req, res, next) {
    try {
      const { eventId } = req.params;

      const eventRef = db.collection('events').doc(eventId);
      const doc = await eventRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      await eventRef.update({
        status:             'cancelled',
        isRegistrationOpen: false,
        updatedAt:          timestamp
      });

      return res.status(200).json({
        success: true,
        message: 'Event cancelled successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Protected: Register standard user for an event
   */
  async registerForEvent(req, res, next) {
    try {
      const uid       = req.user.uid;
      const { eventId } = req.params;

      const eventRef = db.collection('events').doc(eventId);
      const userRef  = db.collection('users').doc(uid);

      const timestamp = admin.firestore.Timestamp.fromDate(new Date());

      const result = await db.runTransaction(async (transaction) => {
        const eventSnap = await transaction.get(eventRef);
        if (!eventSnap.exists) {
          throw new Error('Event not found');
        }

        const event    = eventSnap.data();
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists) {
          throw new Error('User profile not found');
        }

        const user = userSnap.data();

        if (event.registeredCount >= event.totalSeats) {
          throw new Error('Registration failed: Seating capacity reached');
        }

        const deadline = event.registrationDeadline._seconds ? event.registrationDeadline._seconds * 1000 : event.registrationDeadline;
        if (Date.now() > new Date(deadline).getTime()) {
          throw new Error('Registration failed: Deadline has passed');
        }

        const registrationId = `${eventId}_${uid}`;
        const regRef         = db.collection('event_registrations').doc(registrationId);
        const regSnap        = await transaction.get(regRef);
        if (regSnap.exists) {
          throw new Error('You are already registered for this event');
        }

        transaction.set(regRef, {
          registrationId,
          eventId,
          eventTitle: event.title,
          userId:     uid,
          userName:   user.fullName,
          userEmail:  user.email,
          userPhone:  user.phone,
          status:     'confirmed',
          createdAt:  timestamp,
          updatedAt:  timestamp
        });

        transaction.update(eventRef, {
          registeredCount: event.registeredCount + 1,
          updatedAt:       timestamp
        });

        return {
          registrationId,
          eventTitle: event.title,
          userEmail:  user.email,
          userName:   user.fullName
        };
      });

      emailService.sendMail({
        to:      result.userEmail,
        subject: `Confirmed: Registration for ${result.eventTitle} 🎪`,
        html:    `<h3>Hi ${result.userName},</h3><p>Your seat has been reserved successfully for the event: <strong>${result.eventTitle}</strong>!</p><p>Please carry a digital copy of this email to the venue. We look forward to seeing you.</p>`
      }).catch(err => console.error('Event registration email error:', err.message));

      return res.status(200).json({
        success:        true,
        registrationId: result.registrationId,
        message:        'Registration successful! Confirmation email has been sent.'
      });
    } catch (error) {
      return res.status(400).json({ error: error.message || 'Registration failed' });
    }
  },

  /**
   * Admin-Only: List registrations for an event
   */
  async getEventRegistrations(req, res, next) {
    try {
      const { eventId } = req.params;

      const snap = await db.collection('event_registrations')
        .where('eventId', '==', eventId)
        .orderBy('createdAt', 'desc')
        .get();

      const list = [];
      snap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });

      return res.status(200).json({
        success:       true,
        registrations: list
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = eventsController;
