/**
 * Seed Sample Testimonials into Firestore
 * Run: node src/scripts/seed_testimonials.js
 */
const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const SAMPLE_TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    role: "Beneficiary",
    organization: "Hyderabad Community",
    location: "Hyderabad, Telangana",
    headline: "Life-changing healthcare support",
    message: "Vidyavaidya's free medical camp saved my father's life. The doctors were incredible and the medicines provided were exactly what he needed. I am forever grateful to this wonderful organization for their selfless service to our community.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    coverImageUrl: "",
    isFeatured: true,
    isPublished: true,
    displayOrder: 1,
    category: "Beneficiary"
  },
  {
    name: "Priya Sharma",
    role: "Volunteer",
    organization: "Vidyavaidya Foundation",
    location: "Secunderabad, Telangana",
    headline: "An unforgettable volunteering experience",
    message: "Volunteering with Vidyavaidya has been one of the most rewarding experiences of my life. Seeing the smiles on children's faces when they receive educational support is priceless. The team's dedication and passion inspire me every single day.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    coverImageUrl: "",
    isFeatured: true,
    isPublished: true,
    displayOrder: 2,
    category: "Volunteer"
  },
  {
    name: "Anil Reddy",
    role: "Donor",
    organization: "Tech Entrepreneur",
    location: "Bangalore, Karnataka",
    headline: "Every rupee makes a real difference",
    message: "I have been donating to Vidyavaidya for two years now. What sets them apart is their complete transparency — I can see exactly how my contributions are being used. The impact reports are detailed and inspiring. This is an organization you can truly trust.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    coverImageUrl: "",
    isFeatured: false,
    isPublished: true,
    displayOrder: 3,
    category: "Donor"
  },
  {
    name: "Dr. Sunitha Rao",
    role: "Healthcare Partner",
    organization: "Global Health Care",
    location: "Hyderabad, Telangana",
    headline: "Proud to serve communities together",
    message: "Partnering with Vidyavaidya has allowed us to extend our healthcare services to the most underserved communities. Their organizational efficiency and genuine concern for beneficiary welfare makes collaboration seamless and deeply meaningful.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    coverImageUrl: "",
    isFeatured: false,
    isPublished: true,
    displayOrder: 4,
    category: "Healthcare Partner"
  },
  {
    name: "Mohammed Farooq",
    role: "Beneficiary",
    organization: "",
    location: "Warangal, Telangana",
    headline: "Education changed my child's future",
    message: "Thanks to Vidyavaidya's education support program, my daughter now has access to quality learning materials and mentorship she would never have had otherwise. Their commitment to every child's potential is truly admirable and heart-touching.",
    rating: 4,
    avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&q=80",
    coverImageUrl: "",
    isFeatured: false,
    isPublished: true,
    displayOrder: 5,
    category: "Beneficiary"
  }
];

async function seedTestimonials() {
  try {
    console.log('🌱 Seeding testimonials into Firestore...\n');

    // Check existing count first
    const existing = await db.collection('testimonials').get();
    if (existing.size > 0) {
      console.log(`ℹ️  Found ${existing.size} existing testimonials. Skipping seed to avoid duplicates.`);
      console.log('   Delete existing testimonials from Firestore or admin panel first to re-seed.\n');
      process.exit(0);
    }

    const timestamp = admin.firestore.Timestamp.fromDate(new Date());
    const batch = db.batch();

    for (const t of SAMPLE_TESTIMONIALS) {
      const ref = db.collection('testimonials').doc();
      batch.set(ref, {
        testimonialId: ref.id,
        ...t,
        createdBy: 'seed-script',
        createdAt: timestamp,
        updatedAt: timestamp
      });
      console.log(`✅ Queued: ${t.name} (${t.category}) — "${t.headline}"`);
    }

    await batch.commit();
    console.log(`\n🎉 Successfully seeded ${SAMPLE_TESTIMONIALS.length} testimonials into Firestore!`);
    console.log('   They will now appear on the home page testimonials section.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seedTestimonials();
