const { db } = require('../config/firebase');

async function check() {
  try {
    console.log('Fetching foreign donors...');
    const snap = await db.collection('foreign_donors').get();
    console.log(`Found ${snap.size} foreign donor inquiries.`);
    snap.forEach(doc => {
      const d = doc.data();
      console.log(`- ID: ${doc.id}, Name: ${d.firstName} ${d.lastName}, Country: ${d.country}, Status: ${d.status}, Replied: ${d.repliedAt ? 'Yes' : 'No'}`);
    });
    process.exit(0);
  } catch (err) {
    console.error('Error listing foreign donors:', err);
    process.exit(1);
  }
}

check();
