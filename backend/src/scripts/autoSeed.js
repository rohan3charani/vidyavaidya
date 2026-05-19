/**
 * Vidyavaidya — Auto Firestore Initializer
 * Called on server startup. Checks if collections exist and seeds them
 * if the database is empty (first-run scenario).
 */

const admin = require('firebase-admin');

async function autoSeedIfEmpty(db) {
  try {
    console.log('\n🔍 Checking Firestore database state...');

    // Check if the users collection already has documents
    const usersSnap = await db.collection('users').limit(1).get();
    if (!usersSnap.empty) {
      console.log('✅ Firestore already initialized. Skipping auto-seed.\n');
      return false;
    }

    console.log('📭 Database is empty. Running initial seed...\n');
    await runSeed(db);
    return true;
  } catch (err) {
    console.warn('⚠️  Auto-seed skipped (Firestore may not be reachable yet):', err.message);
    return false;
  }
}

async function runSeed(db) {
  const ts = admin.firestore.Timestamp.fromDate(new Date());

  // ─── 1. USERS ─────────────────────────────────────────────────────────────
  const users = [
    {
      uid: 'seed-user-001',
      email: 'donor@vidyavaidya.org',
      phone: '+919876543210',
      fullName: 'Demo Donor',
      role: 'donor',
      isAlumni: false,
      profileComplete: true,
      address: { line: '12, MG Road', city: 'Hyderabad', state: 'Telangana', country: 'India', pincode: '500001' },
      totalDonated: 5000,
      donationCount: 2,
      lastLoginAt: ts,
      createdAt: ts,
      updatedAt: ts,
      isActive: true
    },
    {
      uid: 'seed-admin-001',
      email: 'admin@vidyavaidya.org',
      phone: '+919000000001',
      fullName: 'Vidya Vaidya Admin',
      role: 'admin',
      isAlumni: false,
      profileComplete: true,
      address: { line: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana', country: 'India', pincode: '500034' },
      totalDonated: 0,
      donationCount: 0,
      lastLoginAt: ts,
      createdAt: ts,
      updatedAt: ts,
      isActive: true
    }
  ];

  // ─── 2. DONATIONS ─────────────────────────────────────────────────────────
  const donations = [
    {
      id: 'seed-donation-001',
      donationId: 'VV-2026-000001',
      orderId: 'seed_order_001',
      razorpayPaymentId: 'seed_pay_001',
      userId: 'seed-user-001',
      donorName: 'Demo Donor',
      donorEmail: 'donor@vidyavaidya.org',
      donorPhone: '+919876543210',
      amount: 2500,
      currency: 'INR',
      category: 'Education',
      subcategory: 'School Supplies',
      donationType: 'one-time',
      isRecurring: false,
      status: 'successful',
      paymentMethod: 'upi',
      receiptNumber: 'VV-2026-000001',
      receiptUrl: '',
      createdAt: ts,
      updatedAt: ts
    },
    {
      id: 'seed-donation-002',
      donationId: 'VV-2026-000002',
      orderId: 'seed_order_002',
      razorpayPaymentId: 'seed_pay_002',
      userId: 'seed-user-001',
      donorName: 'Demo Donor',
      donorEmail: 'donor@vidyavaidya.org',
      donorPhone: '+919876543210',
      amount: 2500,
      currency: 'INR',
      category: 'Healthcare',
      subcategory: 'Medical Supplies',
      donationType: 'recurring',
      isRecurring: true,
      status: 'successful',
      paymentMethod: 'card',
      receiptNumber: 'VV-2026-000002',
      receiptUrl: '',
      createdAt: ts,
      updatedAt: ts
    },
    {
      id: 'seed-donation-003',
      donationId: 'VV-2026-000003',
      orderId: 'seed_order_003',
      razorpayPaymentId: '',
      userId: 'seed-user-001',
      donorName: 'Demo Donor',
      donorEmail: 'donor@vidyavaidya.org',
      donorPhone: '+919876543210',
      amount: 1000,
      currency: 'INR',
      category: 'Community',
      subcategory: 'Food Aid',
      donationType: 'one-time',
      isRecurring: false,
      status: 'pending',
      paymentMethod: 'netbanking',
      receiptNumber: '',
      receiptUrl: '',
      createdAt: ts,
      updatedAt: ts
    }
  ];

  // ─── 3. SUBSCRIPTIONS ─────────────────────────────────────────────────────
  const subscriptions = [
    {
      id: 'seed-subscription-001',
      subscriptionId: 'seed_sub_001',
      planId: 'seed_plan_001',
      userId: 'seed-user-001',
      donorEmail: 'donor@vidyavaidya.org',
      amount: 2500,
      currency: 'INR',
      category: 'Healthcare',
      subcategory: 'Medical Supplies',
      status: 'active',
      totalCount: 12,
      paidCount: 1,
      remainingCount: 11,
      startAt: ts,
      createdAt: ts,
      updatedAt: ts
    }
  ];

  const events = [];

  // ─── 5. STORIES ───────────────────────────────────────────────────────────
  const stories = [
    {
      id: 'seed-story-001',
      slug: 'vidyavaidya-helps-500-children-in-2025',
      title: 'Vidyavaidya Foundation Helped 500+ Children in 2025',
      excerpt: 'In a landmark year, Vidyavaidya Foundation extended healthcare and educational support to over 500 underprivileged children.',
      content: 'Vidyavaidya Foundation marked a significant milestone in 2025 by successfully supporting over 500 children across Telangana and Andhra Pradesh...',
      author: 'Vidyavaidya Team',
      type: 'news',
      category: 'Impact',
      imageUrl: '',
      tags: ['impact', '2025', 'children', 'healthcare', 'education'],
      isPublished: true,
      publishedAt: ts,
      createdAt: ts,
      updatedAt: ts
    },
    {
      id: 'seed-story-002',
      slug: 'annual-health-camp-recap',
      title: 'Recap: Our Annual Health Camp Was a Huge Success',
      excerpt: 'More than 300 patients received free consultations and medications at our annual health camp.',
      content: 'Our medical volunteers dedicated an entire weekend to serving the community. Over 300 patients received free consultations...',
      author: 'Dr. Ramesh Kumar',
      type: 'blog',
      category: 'Healthcare',
      imageUrl: '',
      tags: ['health-camp', 'volunteers', 'doctors', 'community'],
      isPublished: true,
      publishedAt: ts,
      createdAt: ts,
      updatedAt: ts
    },
    {
      id: 'seed-story-003',
      slug: 'health-camp-gallery-2025',
      title: 'Health Camp Photo Gallery — 2025',
      excerpt: 'View photos from our Annual Health Camp 2025.',
      content: '',
      author: 'Vidyavaidya Team',
      type: 'gallery',
      mediaType: 'photo',
      imageUrl: '',
      mediaUrls: [],
      tags: ['gallery', 'health-camp', '2025'],
      isPublished: true,
      publishedAt: ts,
      createdAt: ts,
      updatedAt: ts
    }
  ];

  // ─── 6. PARTNERS ──────────────────────────────────────────────────────────
  const partners = [
    {
      id: 'seed-partner-001',
      slug: 'sairam-hospital',
      name: 'Sairam Hospital',
      type: 'hospital',
      description: 'Sairam Hospital provides free medical consultations and discounted treatments for Vidyavaidya patients.',
      logo: '',
      website: 'https://sairamhospital.in',
      location: 'Hyderabad, Telangana',
      contactPerson: 'Dr. S. Rao',
      contactEmail: 'admin@sairamhospital.in',
      contactPhone: '+919000001111',
      services: ['General Medicine', 'Pediatrics', 'Gynaecology'],
      displayOrder: 1,
      isActive: true,
      partnerSince: ts,
      createdAt: ts,
      updatedAt: ts
    },
    {
      id: 'seed-partner-002',
      slug: 'charani-infotech',
      name: 'Charani Infotech',
      type: 'corporate',
      description: 'Official technology partner providing pro-bono software, hosting, and digital infrastructure support.',
      logo: '',
      website: 'https://charaniinfotech.com',
      location: 'Hyderabad, Telangana',
      contactPerson: 'Rohan Charani',
      contactEmail: 'tech@charaniinfotech.com',
      contactPhone: '+919000002222',
      services: ['Web Development', 'Cloud Hosting', 'Digital Marketing'],
      displayOrder: 2,
      isActive: true,
      partnerSince: ts,
      createdAt: ts,
      updatedAt: ts
    }
  ];

  // ─── 7. CONTACTS ──────────────────────────────────────────────────────────
  const contacts = [
    {
      id: 'seed-contact-001',
      name: 'Arjun Sharma',
      email: 'arjun.sharma@example.com',
      phone: '+919876500001',
      subject: 'Question about 80G Tax Exemption',
      message: 'I made a donation of Rs. 5000. Can you guide me on claiming 80G tax exemption?',
      queryType: 'Tax & Receipts',
      status: 'open',
      assignedTo: '',
      adminNotes: '',
      createdAt: ts,
      updatedAt: ts
    },
    {
      id: 'seed-contact-002',
      name: 'Priya Nair',
      email: 'priya.nair@example.com',
      phone: '+919876500002',
      subject: 'Volunteering Opportunities',
      message: 'I am a doctor and would love to volunteer for your health camps.',
      queryType: 'Volunteering',
      status: 'resolved',
      assignedTo: 'Admin',
      adminNotes: 'Connected with the volunteer coordinator. Resolved.',
      resolvedAt: ts,
      createdAt: ts,
      updatedAt: ts
    }
  ];

  // ─── 8. COMMUNITY APPLICATIONS ────────────────────────────────────────────
  const communityApplications = [
    {
      id: 'seed-application-001',
      userId: 'seed-user-001',
      type: 'volunteer',
      status: 'approved',
      volunteerDetails: {
        fullName: 'Demo Donor',
        email: 'donor@vidyavaidya.org',
        phone: '+919876543210',
        profession: 'Doctor',
        skills: ['Medical Consultation', 'First Aid'],
        availability: 'Weekends',
        motivation: 'I want to give back to the community using my medical skills.'
      },
      adminNotes: 'Approved. Assigned to health camp team.',
      reviewedBy: 'seed-admin-001',
      reviewedAt: ts,
      createdAt: ts,
      updatedAt: ts
    },
    {
      id: 'seed-application-002',
      userId: null,
      type: 'hospital',
      status: 'pending',
      hospitalDetails: {
        hospitalName: 'City Care Clinic',
        registrationNumber: 'TS-HOSP-20231234',
        contactPerson: 'Dr. Meena Reddy',
        email: 'info@citycareclinic.in',
        phone: '+919000003333',
        location: 'Secunderabad, Telangana',
        bedsCount: 50,
        specializations: ['General Medicine', 'Paediatrics'],
        proposedServices: 'Free OPD for Vidyavaidya referred patients twice a month'
      },
      adminNotes: '',
      reviewedBy: '',
      reviewedAt: null,
      createdAt: ts,
      updatedAt: ts
    }
  ];

  // ─── 9. ADMIN SETTINGS ────────────────────────────────────────────────────
  const adminSettings = {
    siteName: 'Vidyavaidya Foundation',
    tagline: 'Empowering Lives Through Healthcare and Education',
    contactEmail: 'vidyavaidyanlr@gmail.com',
    contactPhone: '+91 9876543210',
    address: 'Vidyavaidya Foundation, Banjara Hills, Hyderabad - 500034, Telangana, India',
    fcraNumber: 'FCRA-2024-VVNLR',
    section80GNumber: '80G/2024/VV/HYD',
    panNumber: 'AAAVV1234F',
    socialLinks: {
      facebook: 'https://facebook.com/vidyavaidya',
      instagram: 'https://instagram.com/vidyavaidya',
      twitter: 'https://twitter.com/vidyavaidya',
      youtube: 'https://youtube.com/vidyavaidya'
    },
    donationGoal: 1000000,
    currentRaised: 5000,
    maintenanceMode: false,
    updatedAt: ts,
    updatedBy: 'auto-seed'
  };

  // ─── 10. DONATE SETTINGS ─────────────────────────────────────────────────
  const donateSettings = {
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_stubkeyid',
    currency: 'INR',
    minAmount: 100,
    suggestedAmounts: [500, 1000, 2500, 5000, 10000],
    causes: [
      {
        id: 'education',
        label: 'Education',
        description: 'Support school supplies, uniforms, and scholarships for underprivileged children.',
        icon: '📚',
        subcategories: ['School Supplies', 'Scholarships', 'Tuition Support', 'Digital Learning']
      },
      {
        id: 'healthcare',
        label: 'Healthcare',
        description: 'Fund free medical camps, medicines, and treatments for those who cannot afford healthcare.',
        icon: '🏥',
        subcategories: ['Medical Supplies', 'Free Camps', 'Surgeries', 'Mental Health']
      },
      {
        id: 'community',
        label: 'Community',
        description: 'Support food aid, housing, and skill training programs.',
        icon: '🤝',
        subcategories: ['Food Aid', 'Skill Training', 'Housing Support', 'Women Empowerment']
      }
    ],
    plans: [
      { label: '3 Months', value: 3, months: 3 },
      { label: '6 Months', value: 6, months: 6 },
      { label: '12 Months (Annual)', value: 12, months: 12 }
    ],
    updatedAt: ts
  };

  // ─── Write All Collections ────────────────────────────────────────────────
  const collectionsToSeed = [
    { name: 'users',                  docs: users },
    { name: 'donations',              docs: donations },
    { name: 'subscriptions',          docs: subscriptions },
    { name: 'events',                 docs: events },
    { name: 'stories',                docs: stories },
    { name: 'partners',               docs: partners },
    { name: 'contacts',               docs: contacts },
    { name: 'community_applications', docs: communityApplications }
  ];

  for (const col of collectionsToSeed) {
    const batch = db.batch();
    for (const doc of col.docs) {
      const { id, ...data } = doc;
      const ref = id
        ? db.collection(col.name).doc(id)
        : db.collection(col.name).doc();
      batch.set(ref, data, { merge: true });
    }
    await batch.commit();
    console.log(`   ✅ ${col.name} (${col.docs.length} doc${col.docs.length > 1 ? 's' : ''})`);
  }

  // Single-document collections
  await db.collection('admin_settings').doc('global').set(adminSettings, { merge: true });
  console.log('   ✅ admin_settings (1 doc)');

  await db.collection('donate_settings').doc('public').set(donateSettings, { merge: true });
  console.log('   ✅ donate_settings (1 doc)');

  console.log('\n🎉 All 10 Firestore collections created successfully!');
  console.log('   Open https://console.firebase.google.com to verify.\n');
}

module.exports = { autoSeedIfEmpty, runSeed };
