/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║     VIDYAVAIDYA — FIRESTORE DATABASE SEEDER                  ║
 * ║     Initializes ALL required collections with seed data      ║
 * ║     Run: node src/scripts/seedDatabase.js                    ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Collections created:
 *  1. users               - Registered donor / user profiles
 *  2. donations           - Individual donation ledger transactions
 *  3. subscriptions       - Recurring monthly billing plans
 *  4. events              - Upcoming / past Vidyavaidya events
 *  5. stories             - News articles, blogs, press releases
 *  6. partners            - NGO, hospital, corporate partner profiles
 *  7. contacts            - Helpline inquiry tickets submitted via forms
 *  8. community_applications - Volunteer / corporate / hospital applications
 *  9. admin_settings      - Global CMS configuration flags
 * 10. donate_settings     - Public donation form options and Razorpay key
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const admin = require('firebase-admin');

// ─── Firebase Initialization ──────────────────────────────────────────────────
let serviceAccount;

if (
  process.env.FIRESTORE_PRIVATE_KEY &&
  process.env.FIRESTORE_CLIENT_EMAIL &&
  process.env.FIRESTORE_PROJECT_ID
) {
  serviceAccount = {
    projectId: process.env.FIRESTORE_PROJECT_ID.replace(/"/g, ''),
    clientEmail: process.env.FIRESTORE_CLIENT_EMAIL.replace(/"/g, ''),
    privateKey: process.env.FIRESTORE_PRIVATE_KEY.replace(/"/g, '').replace(/\\n/g, '\n')
  };
} else {
  try {
    serviceAccount = require('../../vidya-vaidya-firebase-adminsdk-fbsvc-a9a1e4dda5.json');
  } catch (err) {
    console.error('❌ Could not load Firebase service account credentials.');
    console.error('   Set FIRESTORE_PROJECT_ID, FIRESTORE_CLIENT_EMAIL, FIRESTORE_PRIVATE_KEY in .env');
    console.error('   OR place the service account JSON in the backend/ root directory.');
    process.exit(1);
  }
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET ||
      `${serviceAccount.projectId || 'vidya-vaidya'}.appspot.com`
  });
}

const db = admin.firestore();
const ts = admin.firestore.Timestamp.fromDate(new Date());

// ─── Seed Data Definitions ────────────────────────────────────────────────────

const USERS = [
  {
    id: 'seed-user-001',
    uid: 'seed-user-001',
    email: 'donor@vidyavaidya.org',
    phone: '+919876543210',
    fullName: 'Demo Donor',
    role: 'donor',
    isAlumni: false,
    profileComplete: true,
    address: {
      line: '12, MG Road',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      pincode: '500001'
    },
    pan: '',
    totalDonated: 5000,
    donationCount: 2,
    lastLoginAt: ts,
    createdAt: ts,
    updatedAt: ts,
    isActive: true
  },
  {
    id: 'seed-admin-001',
    uid: 'seed-admin-001',
    email: 'admin@vidyavaidya.org',
    phone: '+919000000001',
    fullName: 'Vidya Vaidya Admin',
    role: 'admin',
    isAlumni: false,
    profileComplete: true,
    address: {
      line: 'Vidyavaidya Foundation, Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      pincode: '500034'
    },
    pan: '',
    totalDonated: 0,
    donationCount: 0,
    lastLoginAt: ts,
    createdAt: ts,
    updatedAt: ts,
    isActive: true
  }
];

const DONATIONS = [
  {
    id: 'seed-donation-001',
    donationId: 'VV-2026-000001',
    orderId: 'seed_order_001',
    razorpayPaymentId: 'seed_pay_001',
    userId: 'seed-user-001',
    donorName: 'Demo Donor',
    donorEmail: 'donor@vidyavaidya.org',
    donorPhone: '+919876543210',
    pan: '',
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
    adminNotes: '',
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
    pan: '',
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
    adminNotes: '',
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
    pan: '',
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
    adminNotes: '',
    createdAt: ts,
    updatedAt: ts
  }
];

const SUBSCRIPTIONS = [
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
    nextChargeAt: ts,
    startAt: ts,
    createdAt: ts,
    updatedAt: ts
  }
];

const EVENTS = [
  {
    id: 'seed-event-001',
    slug: 'annual-health-camp-2026',
    title: 'Annual Free Health Camp 2026',
    description:
      'Vidyavaidya Foundation organizes a free health camp for underprivileged children and families across Hyderabad. Our doctors and volunteers will provide free consultations, medicines, and health awareness sessions.',
    category: 'Healthcare',
    location: 'Vidyavaidya Foundation Hall, Banjara Hills, Hyderabad',
    organizer: 'Vidyavaidya Foundation',
    imageUrl: '',
    startDate: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 3600 * 1000)),
    endDate: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 3600 * 1000 + 8 * 3600 * 1000)),
    registrationDeadline: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 5 * 24 * 3600 * 1000)),
    capacity: 200,
    registeredCount: 1,
    isFree: true,
    registrationFee: 0,
    isPublished: true,
    tags: ['health', 'free', 'children'],
    registrations: ['seed-user-001'],
    createdAt: ts,
    updatedAt: ts
  },
  {
    id: 'seed-event-002',
    slug: 'scholarship-distribution-2026',
    title: 'Scholarship Distribution Ceremony 2026',
    description:
      'Join us for the annual scholarship distribution ceremony where we award educational grants to deserving students from low-income families across Telangana.',
    category: 'Education',
    location: 'Ravindra Bharathi, Hyderabad',
    organizer: 'Vidyavaidya Foundation',
    imageUrl: '',
    startDate: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 3600 * 1000)),
    endDate: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 3600 * 1000 + 4 * 3600 * 1000)),
    registrationDeadline: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 12 * 24 * 3600 * 1000)),
    capacity: 500,
    registeredCount: 0,
    isFree: true,
    registrationFee: 0,
    isPublished: true,
    tags: ['education', 'scholarship', 'students'],
    registrations: [],
    createdAt: ts,
    updatedAt: ts
  }
];

const STORIES = [
  {
    id: 'seed-story-001',
    slug: 'vidyavaidya-helps-500-children-in-2025',
    title: 'Vidyavaidya Foundation Helped 500+ Children in 2025',
    excerpt: 'In a landmark year, Vidyavaidya Foundation extended healthcare and educational support to over 500 underprivileged children across Telangana and Andhra Pradesh.',
    content:
      'Vidyavaidya Foundation marked a significant milestone in 2025 by successfully supporting over 500 children. Through generous donations from our global community, we were able to provide free health checkups, educational materials, and nutritious meals...',
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
    excerpt: 'More than 300 patients received free consultations and medications at our annual health camp hosted in Banjara Hills, Hyderabad.',
    content:
      'Our medical volunteers dedicated an entire weekend to serving the community. Over 300 patients received free consultations, blood pressure tests, blood sugar screenings, and medicines...',
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
    id: 'seed-story-gallery-001',
    slug: 'health-camp-photo-gallery-2025',
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

const PARTNERS = [
  {
    id: 'seed-partner-001',
    slug: 'sairam-hospital',
    name: 'Sairam Hospital',
    type: 'hospital',
    description:
      'Sairam Hospital has partnered with Vidyavaidya Foundation to provide free medical consultations and discounted treatments for underprivileged patients referred through our programs.',
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
    description:
      'Charani Infotech is the official technology partner of Vidyavaidya Foundation, providing pro-bono software development, hosting, and digital infrastructure support.',
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

const CONTACTS = [
  {
    id: 'seed-contact-001',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@example.com',
    phone: '+919876500001',
    subject: 'Question about 80G Tax Exemption',
    message:
      'Hello, I made a donation of Rs. 5000 last month. Can you please guide me on how to claim 80G tax exemption for this donation?',
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
    message:
      'I am a doctor based in Hyderabad and would love to volunteer for your health camps. Please let me know how I can contribute.',
    queryType: 'Volunteering',
    status: 'resolved',
    assignedTo: 'Admin',
    adminNotes: 'Connected with the volunteer coordinator. Resolved.',
    resolvedAt: ts,
    createdAt: ts,
    updatedAt: ts
  }
];

const COMMUNITY_APPLICATIONS = [
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
      motivation: 'I want to give back to the community by using my medical skills to help underprivileged people.'
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

const ADMIN_SETTINGS = {
  id: 'global',
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
  updatedBy: 'seed-script'
};

const DONATE_SETTINGS = {
  id: 'public',
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
      description: 'Support community development programs including food aid, housing, and skill training.',
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

// ─── Seeder Engine ────────────────────────────────────────────────────────────

async function seedCollection(collectionName, documents) {
  console.log(`\n📂 Seeding collection: "${collectionName}" (${documents.length} document${documents.length !== 1 ? 's' : ''})`);

  const batch = db.batch();

  for (const doc of documents) {
    const { id, ...data } = doc;
    const ref = id
      ? db.collection(collectionName).doc(id)
      : db.collection(collectionName).doc();
    batch.set(ref, data, { merge: true });
    console.log(`   ✅ Queued: "${id || ref.id}"`);
  }

  await batch.commit();
  console.log(`   🔥 Committed to Firestore: "${collectionName}"`);
}

async function seedSingleDocument(collectionName, docId, data) {
  console.log(`\n📂 Seeding document: "${collectionName}/${docId}"`);
  const { id: _id, ...cleanData } = data;
  await db.collection(collectionName).doc(docId).set(cleanData, { merge: true });
  console.log(`   ✅ Written: "${collectionName}/${docId}"`);
}

// ─── Main Execution ───────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║     VIDYAVAIDYA — FIRESTORE DATABASE SEEDER                  ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('\n🚀 Starting database initialization...\n');

  try {
    // 1. Users
    await seedCollection('users', USERS);

    // 2. Donations
    await seedCollection('donations', DONATIONS);

    // 3. Subscriptions
    await seedCollection('subscriptions', SUBSCRIPTIONS);

    // 4. Events
    await seedCollection('events', EVENTS);

    // 5. Stories (news, blogs, gallery)
    await seedCollection('stories', STORIES);

    // 6. Partners
    await seedCollection('partners', PARTNERS);

    // 7. Contact tickets
    await seedCollection('contacts', CONTACTS);

    // 8. Community applications
    await seedCollection('community_applications', COMMUNITY_APPLICATIONS);

    // 9. Admin settings (single global document)
    await seedSingleDocument('admin_settings', 'global', ADMIN_SETTINGS);

    // 10. Public donation form settings
    await seedSingleDocument('donate_settings', 'public', DONATE_SETTINGS);

    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║  ✅  ALL 10 COLLECTIONS SEEDED SUCCESSFULLY!                  ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║  Collections created in Firebase Firestore:                  ║');
    console.log('║  1. users                  2. donations                      ║');
    console.log('║  3. subscriptions          4. events                         ║');
    console.log('║  5. stories                6. partners                       ║');
    console.log('║  7. contacts               8. community_applications         ║');
    console.log('║  9. admin_settings        10. donate_settings                ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    console.log('🌐 Open https://console.firebase.google.com to verify.\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeder failed with error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
