const { db } = require('../config/firebase');

async function verify() {
  try {
    console.log('🔍 Searching for guest user by email...');
    const userSnap = await db.collection('users')
      .where('email', '==', 'guest.donor@gmail.com')
      .get();

    if (userSnap.empty) {
      console.log('❌ No user found for guest.donor@gmail.com');
      process.exit(1);
    }

    userSnap.forEach(doc => {
      console.log('✅ Found Auto-Created User Profile!');
      console.log('Document ID (UID):', doc.id);
      console.log('User Data:', JSON.stringify(doc.data(), null, 2));
    });

    console.log('\n🔍 Searching for pending guest donation...');
    const donationSnap = await db.collection('donations')
      .where('donorEmail', '==', 'guest.donor@gmail.com')
      .get();

    if (donationSnap.empty) {
      console.log('❌ No pending donation found for guest.donor@gmail.com');
    } else {
      donationSnap.forEach(doc => {
        console.log('✅ Found Linked Donation Order!');
        console.log('Document ID (Order ID):', doc.id);
        console.log('Donation Data:', JSON.stringify(doc.data(), null, 2));
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during verification:', error);
    process.exit(1);
  }
}

verify();
