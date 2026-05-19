const { db, storage } = require('../config/firebase');
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

const storiesController = {
  /**
   * Public: List all articles with filtration and page index offset pagination
   */
  async listStories(req, res, next) {
    try {
      const { page = 1, limit = 10, type, featured, tag } = req.query;

      // Fetch all and filter in memory to avoid composite index requirement
      const snap = await db.collection('stories').get();
      let list = [];
      snap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });

      // Filter in memory
      list = list.filter(s => s.isPublished === true);
      if (type) list = list.filter(s => s.type === type);
      if (featured === 'true') list = list.filter(s => s.isFeatured === true);
      if (tag) list = list.filter(s => Array.isArray(s.tags) && s.tags.includes(tag));

      // Sort by publishedAt desc
      list.sort((a, b) => {
        const aTime = a.publishedAt?._seconds || (a.publishedAt ? new Date(a.publishedAt).getTime() / 1000 : 0);
        const bTime = b.publishedAt?._seconds || (b.publishedAt ? new Date(b.publishedAt).getTime() / 1000 : 0);
        return bTime - aTime;
      });

      const total = list.length;
      const pageVal = parseInt(page);
      const limitVal = parseInt(limit);
      const offset = (pageVal - 1) * limitVal;
      const paginatedList = list.slice(offset, offset + limitVal);

      return res.status(200).json({
        success: true,
        stories: paginatedList,
        total,
        page: pageVal,
        hasMore: total > pageVal * limitVal
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Public: Fetch single article details and increment view counters
   */
  async getStoryBySlug(req, res, next) {
    try {
      const { slug } = req.params;

      const snap = await db.collection('stories')
        .where('slug', '==', slug)
        .limit(1)
        .get();

      if (snap.empty) {
        return res.status(404).json({ error: 'Article not found' });
      }

      const doc = snap.docs[0];
      const story = doc.data();

      // Asynchronous counter increment
      doc.ref.update({
        viewCount: admin.firestore.FieldValue.increment(1)
      }).catch(() => {});

      return res.status(200).json({
        success: true,
        story: { id: doc.id, ...story }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Publish new media article
   */
  async createStory(req, res, next) {
    try {
      const { title, type, content, excerpt, coverImageUrl, galleryUrls = [], tags = [], source = 'Vidyavaidya Board', externalUrl = '', isFeatured = false, isPublished = true } = req.body;

      const slug = slugify(title);
      const timestamp = admin.firestore.Timestamp.fromDate(new Date());

      const storyRef = db.collection('stories').doc();
      const newStory = {
        storyId: storyRef.id,
        title,
        slug,
        type, // "news" | "impact" | "publishing" | "press" | "blog"
        content,
        excerpt: excerpt || content.slice(0, 150),
        coverImageUrl: coverImageUrl || '',
        galleryUrls,
        author: {
          name: req.user.fullName || 'Vidyavaidya Board',
          role: 'Administrator',
          avatarUrl: ''
        },
        tags,
        source,
        externalUrl,
        isFeatured,
        isPublished,
        viewCount: 0,
        publishedAt: isPublished ? timestamp : null,
        createdBy: req.user.uid,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      await storyRef.set(newStory);

      return res.status(201).json({
        success: true,
        message: 'Story created successfully',
        story: newStory
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Edit article content details
   */
  async updateStory(req, res, next) {
    try {
      const { storyId } = req.params;
      const updates = { ...req.body };

      const storyRef = db.collection('stories').doc(storyId);
      const storySnap = await storyRef.get();

      if (!storySnap.exists) {
        return res.status(404).json({ error: 'Article not found' });
      }

      if (updates.title && updates.title !== storySnap.data().title) {
        updates.slug = slugify(updates.title);
      }

      if (updates.isPublished === true && !storySnap.data().publishedAt) {
        updates.publishedAt = admin.firestore.Timestamp.fromDate(new Date());
      }

      updates.updatedAt = admin.firestore.Timestamp.fromDate(new Date());

      await storyRef.update(updates);

      const finalSnap = await storyRef.get();
      return res.status(200).json({
        success: true,
        message: 'Story updated successfully',
        story: finalSnap.data()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Soft delete an article
   */
  async deleteStory(req, res, next) {
    try {
      const { storyId } = req.params;

      const storyRef = db.collection('stories').doc(storyId);
      const storySnap = await storyRef.get();
      if (!storySnap.exists) {
        return res.status(404).json({ error: 'Article not found' });
      }

      await storyRef.update({
        isPublished: false,
        updatedAt: admin.firestore.Timestamp.fromDate(new Date())
      });

      return res.status(200).json({
        success: true,
        message: 'Story deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Public: Query Photo Gallery Items
   */
  async listPhotoGallery(req, res, next) {
    try {
      const snap = await db.collection('stories').get();
      const photos = [];
      snap.forEach(doc => {
        const d = doc.data();
        if (d.type === 'gallery_photo' && d.isPublished === true) {
          photos.push({ id: doc.id, ...d });
        }
      });
      photos.sort((a, b) => {
        const aTime = a.publishedAt?._seconds || 0;
        const bTime = b.publishedAt?._seconds || 0;
        return bTime - aTime;
      });
      return res.status(200).json({ success: true, photos });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Public: Query Video Gallery Links
   */
  async listVideoGallery(req, res, next) {
    try {
      const snap = await db.collection('stories').get();
      const videos = [];
      snap.forEach(doc => {
        const d = doc.data();
        if (d.type === 'gallery_video' && d.isPublished === true) {
          videos.push({ id: doc.id, ...d });
        }
      });
      videos.sort((a, b) => {
        const aTime = a.publishedAt?._seconds || 0;
        const bTime = b.publishedAt?._seconds || 0;
        return bTime - aTime;
      });
      return res.status(200).json({ success: true, videos });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Generate temporary pre-signed PUT token to upload files directly
   */
  async getUploadUrl(req, res, next) {
    try {
      const { fileName, contentType } = req.body;

      if (!fileName || !contentType) {
        return res.status(400).json({ error: 'fileName and contentType parameters are required' });
      }

      const bucket = storage.bucket();
      const uniqueName = `gallery/${Date.now()}_${fileName}`;
      const file = bucket.file(uniqueName);

      // Issue signed upload session
      const [uploadUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes session
        contentType
      });

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueName}`;

      return res.status(200).json({
        success: true,
        uploadUrl,
        publicUrl
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = storiesController;
