const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require('./src/app');
const http = require('http');
const { db, admin } = require('./src/config/firebase');
const { autoSeedIfEmpty, runSeed } = require('./src/scripts/autoSeed');
const fs = require('fs');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// ─── Auto-Upload News helper function ─────────────────────────────────────────
async function autoUploadNewsStories(db, admin) {
  try {
    // 1. Check if news articles are already seeded
    const newsSnap = await db.collection('stories').where('type', '==', 'news').limit(15).get();
    if (newsSnap.size >= 10) {
      console.log(`✅ News stories already seeded in database (${newsSnap.size} found). Skipping auto-upload.`);
      return;
    }

    const assetsDir = path.join(__dirname, '..', 'dist', 'assets', 'news');
    console.log(`📂 Auto-uploading news images from: ${assetsDir}`);

    if (!fs.existsSync(assetsDir)) {
      console.warn(`⚠️ News assets directory does not exist: ${assetsDir}`);
      return;
    }

    const files = fs.readdirSync(assetsDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    console.log(`📸 Found ${files.length} news images to process.`);

    if (files.length === 0) {
      return;
    }

    const BATCH_SIZE = 40;
    let uploadedCount = 0;
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const chunk = files.slice(i, i + BATCH_SIZE);
      const batch = db.batch();

      for (const filename of chunk) {
        const filePath = path.join(assetsDir, filename);
        const fileBuffer = fs.readFileSync(filePath);
        const base64DataUrl = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;

        const match = filename.match(/^(\d+)/);
        let date = new Date();
        let title = 'Press Coverage — Archive';
        
        if (match) {
          const timestamp = parseInt(match[1]);
          date = new Date(timestamp);
          const dateString = date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
          title = `Press Coverage — ${dateString}`;
        }

        const slug = `news-article-${filename.replace(/\.[^/.]+$/, "")}`;
        const ts = admin.firestore.Timestamp.fromDate(date);

        const storyDoc = {
          slug,
          title,
          excerpt: `VidyaVaidya local press coverage archive showing media clipping from ${title.replace("Press Coverage — ", "")}.`,
          content: `VidyaVaidya local press coverage archive showing media clipping from ${title.replace("Press Coverage — ", "")}.`,
          author: 'VidyaVaidya Team',
          type: 'news',
          category: 'Press',
          coverImageUrl: base64DataUrl,
          tags: ['press', 'news', 'archive'],
          isPublished: true,
          publishedAt: ts,
          createdAt: ts,
          updatedAt: admin.firestore.Timestamp.fromDate(new Date())
        };

        const docRef = db.collection('stories').doc(slug);
        batch.set(docRef, storyDoc, { merge: true });
        uploadedCount++;
      }

      await batch.commit();
      console.log(`💾 Committed news batch ${Math.floor(i / BATCH_SIZE) + 1} (${chunk.length} items)`);
    }

    console.log(`🎉 Successfully uploaded ${uploadedCount} news stories to Firestore stories collection.`);
  } catch (err) {
    console.error('❌ autoUploadNewsStories error:', err);
  }
}

// ─── Manual Seed Endpoint (callable from browser while server is running) ─────
// GET http://localhost:5000/api/seed         — seeds only if collections are empty
// GET http://localhost:5000/api/seed?force=1 — always re-seeds all collections
app.get('/api/seed', async (req, res) => {
  try {
    if (req.query.force === '1') {
      console.log('\n🌱 Force-seed requested via HTTP...');
      await runSeed(db);
      return res.json({ success: true, message: '✅ All 10 Firestore collections seeded successfully (force mode).' });
    }

    const usersSnap = await db.collection('users').limit(1).get();
    if (!usersSnap.empty) {
      return res.json({ success: true, message: '✅ Firestore already has data. Use ?force=1 to re-seed.' });
    }

    await runSeed(db);
    return res.json({ success: true, message: '✅ All 10 Firestore collections seeded successfully.' });
  } catch (err) {
    console.error('❌ Seed endpoint error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET http://localhost:5000/api/upload-news — force uploads news clippings
app.get('/api/upload-news', async (req, res) => {
  try {
    // Force delete existing to reload cleanly
    const newsSnap = await db.collection('stories').where('type', '==', 'news').get();
    if (!newsSnap.empty) {
      console.log(`🗑️ Clearing ${newsSnap.size} existing news stories before manual reload...`);
      const deleteBatch = db.batch();
      newsSnap.forEach(doc => deleteBatch.delete(doc.ref));
      await deleteBatch.commit();
    }
    
    // Call the auto uploader which will now see 0 records
    await autoUploadNewsStories(db, admin);
    return res.json({ success: true, message: '✅ Force uploaded all news articles successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Start HTTP Server ────────────────────────────────────────────────────────
server.listen(PORT, async () => {
  console.log('===================================================');
  console.log(`🔥 Vidyavaidya engine running in [${process.env.NODE_ENV || 'development'}] mode`);
  console.log(`🌐 Server listening on port: ${PORT}`);
  console.log('===================================================');

  // Auto-seed Firestore on first boot if database is empty
  try {
    await autoSeedIfEmpty(db);
  } catch (err) {
    console.warn('⚠️  Auto-seed encountered an issue:', err.message);
  }

  // Auto-upload news clippings on startup
  try {
    await autoUploadNewsStories(db, admin);
  } catch (err) {
    console.warn('⚠️  Auto-upload of news clippings encountered an issue:', err.message);
  }

  console.log('─────────────────────────────────────────────────');
  console.log(`🌱 Seed endpoint: http://localhost:${PORT}/api/seed`);
  console.log(`🌱 Force re-seed: http://localhost:${PORT}/api/seed?force=1`);
  console.log(`🌱 News uploader: http://localhost:${PORT}/api/upload-news`);
  console.log('─────────────────────────────────────────────────\n');
});

// ─── Error Handlers ───────────────────────────────────────────────────────────
process.on('uncaughtException', (error) => {
  console.error('❌ CRITICAL: Uncaught Exception detected!');
  console.error(error.stack || error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('⚠️  Unhandled Promise Rejection:', reason?.stack || reason);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Signal [${signal}] received. Shutting down gracefully...`);

  server.close(() => {
    console.log('🚪 HTTP server closed.');
    console.log('✅ System terminated. Bye!');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('⏳ Shutdown timeout exceeded. Forcing exit...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

