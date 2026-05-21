const fs = require('fs');
const path = require('path');
const { db, admin } = require('../config/firebase');

async function uploadNewsStories() {
  try {
    const assetsDir = "D:\\vidyavaidya\\dist\\assets\\news";
    console.log(`📂 Reading news images from: ${assetsDir}`);

    if (!fs.existsSync(assetsDir)) {
      console.error(`❌ Directory does not exist: ${assetsDir}`);
      process.exit(1);
    }

    const files = fs.readdirSync(assetsDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    console.log(`📸 Found ${files.length} news images to process.`);

    if (files.length === 0) {
      console.log('⚠️ No images found to upload.');
      process.exit(0);
    }

    // Split files into batches of 40 to prevent overwhelming memory or Firestore payload limits
    const BATCH_SIZE = 40;
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const chunk = files.slice(i, i + BATCH_SIZE);
      console.log(`\n🚀 Processing batch ${Math.floor(i / BATCH_SIZE) + 1} (${chunk.length} files)...`);

      const batch = db.batch();

      for (const filename of chunk) {
        const filePath = path.join(assetsDir, filename);
        const fileBuffer = fs.readFileSync(filePath);
        
        // Convert to base64 Data URL
        const base64DataUrl = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;

        // Try to parse timestamp from filename (e.g. 1776248712626-D77dGUbh.jpg)
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
        console.log(`  ➕ Added document to batch: ${slug} ("${title}")`);
      }

      console.log(`💾 Committing batch to Firestore...`);
      await batch.commit();
      console.log(`✅ Batch committed successfully!`);
    }

    console.log(`\n🎉 Success! All ${files.length} images uploaded to Firestore stories collection.`);
  } catch (error) {
    console.error("❌ Error uploading news stories:", error);
  }
  process.exit(0);
}

uploadNewsStories();
