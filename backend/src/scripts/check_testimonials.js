console.log('Script started');
const { db } = require('../config/firebase');

async function check() {
  try {
    console.log('Fetching testimonials...');
    const snap = await db.collection('testimonials').get();
    console.log(`Found ${snap.size} testimonials.`);
    snap.forEach(doc => {
      console.log(`- ID: ${doc.id}, Name: ${doc.data().name}, isPublished: ${doc.data().isPublished}`);
    });
    process.exit(0);
  } catch (err) {
    console.error('Error listing testimonials:', err);
    process.exit(1);
  }
}

check();
