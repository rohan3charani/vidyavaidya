const { db } = require('../config/firebase');

async function checkStories() {
  try {
    const snap = await db.collection('stories').get();
    console.log(`Found ${snap.size} stories in database:`);
    snap.forEach(doc => {
      const data = doc.data();
      console.log(`- ID: ${doc.id}, Title: "${data.title}", Type: "${data.type}", isPublished: ${data.isPublished}, coverImageUrl: ${data.coverImageUrl ? data.coverImageUrl.substring(0, 50) + "..." : "None"}`);
    });
  } catch (error) {
    console.error("Error checking stories:", error);
  }
  process.exit(0);
}

checkStories();
