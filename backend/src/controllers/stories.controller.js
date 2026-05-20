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

const uploadBase64Helper = async (base64Data, defaultName = 'image.jpg') => {
  if (!base64Data || !base64Data.startsWith('data:image/')) {
    return base64Data; // Already a URL or empty
  }
  try {
    const match = base64Data.match(/^data:(image\/\w+);base64,/);
    if (!match) return base64Data;
    const contentType = match[1];
    const ext = contentType.split('/')[1] || 'jpg';
    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Clean, 'base64');

    const bucket = storage.bucket();
    const uniqueName = `stories/${Date.now()}_${defaultName.replace(/[^a-zA-Z0-9]/g, '_')}.${ext}`;
    const file = bucket.file(uniqueName);

    await file.save(buffer, {
      metadata: {
        contentType: contentType,
        cacheControl: 'public, max-age=31536000'
      },
      public: true
    });

    return `https://storage.googleapis.com/${bucket.name}/${uniqueName}`;
  } catch (err) {
    console.error('Failed to upload base64 image to storage:', err);
    return base64Data; // Fallback to base64
  }
};

const storiesController = {
  /**
   * Public: List all articles with filtration and page index offset pagination
   */
  async listStories(req, res, next) {
    try {
      const { page = 1, limit = 10, type, featured, tag } = req.query;

      let queryRef = db.collection('stories').where('isPublished', '==', true);

      if (type) queryRef = queryRef.where('type', '==', type);
      if (featured === 'true') queryRef = queryRef.where('isFeatured', '==', true);
      if (tag) queryRef = queryRef.where('tags', 'array-contains', tag);

      const snap = await queryRef.get();
      const list = [];
      snap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });

      // Sort in-memory to prevent composite index requirements
      list.sort((a, b) => {
        const dateA = a.publishedAt ? (a.publishedAt._seconds ? a.publishedAt._seconds * 1000 : new Date(a.publishedAt).getTime()) : 0;
        const dateB = b.publishedAt ? (b.publishedAt._seconds ? b.publishedAt._seconds * 1000 : new Date(b.publishedAt).getTime()) : 0;
        return dateB - dateA;
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
      const { title, type, content, excerpt, coverImageUrl, galleryUrls = [], galleryImages = [], tags = [], source = 'Vidyavaidya Board', sourceByline = '', externalUrl = '', isFeatured = false, isPublished = true, authorName = '' } = req.body;

      const slug = slugify(title);
      const timestamp = admin.firestore.Timestamp.fromDate(new Date());

      // If coverImageUrl is base64, automatically upload to Cloud Storage
      let finalCoverImageUrl = coverImageUrl || '';
      if (coverImageUrl && coverImageUrl.startsWith('data:image/')) {
        finalCoverImageUrl = await uploadBase64Helper(coverImageUrl, title || 'cover');
      }

      const finalGalleryUrls = (galleryUrls && galleryUrls.length > 0) ? galleryUrls : (galleryImages || []);
      const finalSource = source !== 'Vidyavaidya Board' ? source : (sourceByline || 'Vidyavaidya Board');
      const finalAuthorName = authorName || (req.user && req.user.fullName) || 'Vidyavaidya Board';

      const storyRef = db.collection('stories').doc();
      const newStory = {
        storyId: storyRef.id,
        title,
        slug,
        type: type || 'news', // "news" | "impact" | "publishing" | "press" | "blog"
        content: content || excerpt || 'Vidyavaidya featured article.',
        excerpt: excerpt || content?.slice(0, 150) || 'Vidyavaidya featured article.',
        coverImageUrl: finalCoverImageUrl,
        galleryUrls: finalGalleryUrls,
        author: {
          name: finalAuthorName,
          role: 'Administrator',
          avatarUrl: ''
        },
        tags,
        source: finalSource,
        externalUrl,
        isFeatured: !!isFeatured,
        isPublished: !!isPublished,
        viewCount: 0,
        publishedAt: isPublished ? timestamp : null,
        createdBy: (req.user && req.user.uid) || 'admin',
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

      // If coverImageUrl is updated with a base64 string, upload to Cloud Storage
      if (updates.coverImageUrl && updates.coverImageUrl.startsWith('data:image/')) {
        updates.coverImageUrl = await uploadBase64Helper(updates.coverImageUrl, updates.title || storySnap.data().title || 'cover');
      }

      if (updates.galleryImages !== undefined && updates.galleryUrls === undefined) {
        updates.galleryUrls = updates.galleryImages;
        delete updates.galleryImages;
      }

      if (updates.sourceByline !== undefined && updates.source === undefined) {
        updates.source = updates.sourceByline;
        delete updates.sourceByline;
      }

      if (updates.authorName !== undefined) {
        const existingAuthor = storySnap.data().author || { name: 'Vidyavaidya Board', role: 'Administrator', avatarUrl: '' };
        updates.author = {
          ...existingAuthor,
          name: updates.authorName
        };
        delete updates.authorName;
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
      const snap = await db.collection('stories')
        .where('type', '==', 'gallery_photo')
        .where('isPublished', '==', true)
        .get();

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

      // Sort in-memory to prevent composite index requirement
      photos.sort((a, b) => {
        const dateA = a.publishedAt ? (a.publishedAt._seconds ? a.publishedAt._seconds * 1000 : new Date(a.publishedAt).getTime()) : 0;
        const dateB = b.publishedAt ? (b.publishedAt._seconds ? b.publishedAt._seconds * 1000 : new Date(b.publishedAt).getTime()) : 0;
        return dateB - dateA;
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
      const snap = await db.collection('stories')
        .where('type', '==', 'gallery_video')
        .where('isPublished', '==', true)
        .get();

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

      // Sort in-memory to prevent composite index requirement
      videos.sort((a, b) => {
        const dateA = a.publishedAt ? (a.publishedAt._seconds ? a.publishedAt._seconds * 1000 : new Date(a.publishedAt).getTime()) : 0;
        const dateB = b.publishedAt ? (b.publishedAt._seconds ? b.publishedAt._seconds * 1000 : new Date(b.publishedAt).getTime()) : 0;
        return dateB - dateA;
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
  },

  /**
   * Admin-Only: Upload image as base64 directly to Firebase Storage bypassing client-side CORS restrictions
   */
  async uploadBase64(req, res, next) {
    try {
      const { base64Data, fileName, contentType } = req.body;

      if (!base64Data || !fileName || !contentType) {
        return res.status(400).json({ error: 'base64Data, fileName and contentType parameters are required' });
      }

      // Strip off dataurl metadata prefix if present (e.g. data:image/png;base64,)
      const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Clean, 'base64');

      const bucket = storage.bucket();
      const uniqueName = `gallery/${Date.now()}_${fileName}`;
      const file = bucket.file(uniqueName);

      // Save buffer direct to Cloud Storage bucket with public visibility
      await file.save(buffer, {
        metadata: {
          contentType: contentType,
          cacheControl: 'public, max-age=31536000'
        },
        public: true
      });

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueName}`;

      return res.status(200).json({
        success: true,
        publicUrl
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = storiesController;
