const fs = require('fs');
const path = require('path');
const { db } = require('../config/firebase');
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

async function run() {
  try {
    console.log("🚀 Starting Gallery and Video Assets Seeding to Firestore Events (Optimized Base64 Partition)...");

    const photoDir = "D:\\vidyavaidya\\dist\\assets\\photo gallery";
    console.log(`📂 Reading photos from: ${photoDir}`);

    if (!fs.existsSync(photoDir)) {
      console.error(`❌ Directory does not exist: ${photoDir}`);
      process.exit(1);
    }

    const files = fs.readdirSync(photoDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    console.log(`📸 Found ${files.length} images to process.`);

    if (files.length === 0) {
      console.log('⚠️ No gallery images found.');
      process.exit(0);
    }

    const categories = ["Education", "Health", "Community Trust", "Empowerment", "Volunteers"];
    const titles = [
      "Building Trust in Education",
      "Healing Hands, Trusting Hearts",
      "A Community United by Trust",
      "Mentorship Built on Faith",
      "Transforming Lives Together",
      "Healthcare You Can Trust",
      "Empowering the Next Generation",
      "Charity in Action"
    ];
    const descriptions = [
      "Providing essential learning tools to underprivileged children, fostering a foundation of trust and hope.",
      "Our dedicated volunteers delivering critical medical care to those who rely on our charitable health camps.",
      "Celebrating milestones with the communities that have placed their unwavering trust in the VidyaVaidya mission.",
      "Volunteers spending quality time guiding youth, proving that consistent support builds lasting trust.",
      "Witnessing the incredible journey from hardship to opportunity through sustained charitable efforts.",
      "Ensuring every child has access to life-saving vaccinations and reliable healthcare services.",
      "Creating safe, engaging environments where children feel trusted to explore, grow, and learn.",
      "Joyful moments captured during our outreach programs, reflecting the true spirit of giving and community trust."
    ];

    console.log("\n🧹 Cleaning existing photo and video gallery items from events collection...");
    const existingSnap = await db.collection('events').get();
    if (!existingSnap.empty) {
      const deleteBatch = db.batch();
      let deleteCount = 0;
      existingSnap.forEach(doc => {
        const data = doc.data();
        if (doc.id.startsWith('gallery-photo-') || doc.id.startsWith('static-video-') || data.eventType === 'video' || data.eventType === 'photo') {
          deleteBatch.delete(doc.ref);
          deleteCount++;
        }
      });
      if (deleteCount > 0) {
        await deleteBatch.commit();
        console.log(`🗑️ Successfully deleted ${deleteCount} existing seed gallery items.`);
      }
    }

    const ts = admin.firestore.Timestamp.fromDate(new Date());

    // 1. SEED PHOTO GALLERY
    // Use BATCH_SIZE = 5 to prevent 60-second gRPC DEADLINE_EXCEEDED timeouts from local network latencies
    const BATCH_SIZE = 5;
    const totalBatches = Math.ceil(files.length / BATCH_SIZE);
    
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const chunk = files.slice(i, i + BATCH_SIZE);
      const currentBatchNum = Math.floor(i / BATCH_SIZE) + 1;
      console.log(`\n🚀 Uploading photo batch ${currentBatchNum}/${totalBatches} (${chunk.length} images)...`);

      const batch = db.batch();

      for (let j = 0; j < chunk.length; j++) {
        const globalIdx = i + j;
        const filename = chunk[j];
        const filePath = path.join(photoDir, filename);
        const fileBuffer = fs.readFileSync(filePath);
        const base64DataUrl = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;

        const category = categories[(globalIdx * 7) % categories.length];
        const title = titles[globalIdx % titles.length];
        const desc = descriptions[globalIdx % descriptions.length];

        const docId = `gallery-photo-${globalIdx}`;
        const docRef = db.collection('events').doc(docId);

        const eventDoc = {
          eventId: docId,
          title: `${title} - Part ${globalIdx + 1}`,
          slug: docId,
          description: desc,
          shortDescription: desc,
          category: category,
          status: "completed",
          thumbnailUrl: base64DataUrl,
          galleryUrls: [base64DataUrl],
          videoUrl: "",
          location: "Nellore & Hyderabad",
          startDate: ts,
          endDate: ts,
          registrationDeadline: ts,
          totalSeats: 0,
          registeredCount: 0,
          isRegistrationOpen: false,
          isFeatured: false,
          organizer: "VidyaVaidya Charity Trust",
          speakers: [],
          tags: ["gallery", "impact", "outreach"],
          eventType: "photo",
          isPublished: true,
          createdAt: ts,
          updatedAt: ts,
          publishedAt: ts
        };

        batch.set(docRef, eventDoc, { merge: true });
      }

      await batch.commit();
      console.log(`💾 Committed photo batch ${currentBatchNum}/${totalBatches} successfully.`);

      // Add a small 200ms delay to give the local network and gRPC channel breathing room
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\n🎉 Successfully uploaded all ${files.length} gallery images to Firestore!`);

    // 2. SEED VIDEO GALLERY
    console.log("\n📹 Seeding video gallery data to Firestore...");
    const staticVideos = [
      {
        title: "Impacting 10,000+ Lives in 2024",
        videoDuration: "12:30",
        videoThumbnailUrl: "https://images.unsplash.com/photo-1494883759339-0b042055a4ee?w=600&q=80",
        videoUrl: "https://www.youtube.com",
        category: "Community Trust"
      },
      {
        title: "Our Medical Mission in Rural India",
        videoDuration: "08:15",
        videoThumbnailUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&q=80",
        videoUrl: "https://www.youtube.com",
        category: "Health"
      },
      {
        title: "Voices of Hope: Beneficiary Stories",
        videoDuration: "15:45",
        videoThumbnailUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80",
        videoUrl: "https://www.youtube.com",
        category: "Community Trust"
      },
      {
        title: "Annual Volunteering Weekend Highlights",
        videoDuration: "05:22",
        videoThumbnailUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80",
        videoUrl: "https://www.youtube.com",
        category: "Volunteers"
      }
    ];

    const videoBatch = db.batch();
    for (let index = 0; index < staticVideos.length; index++) {
      const v = staticVideos[index];
      const docId = `static-video-${index}`;
      const docRef = db.collection('events').doc(docId);

      const eventDoc = {
        eventId: docId,
        title: v.title,
        slug: slugify(v.title),
        description: `${v.title} — documentary highlight and outreach video of VidyaVaidya Charity Trust.`,
        shortDescription: `${v.title} — documentary highlight.`,
        category: v.category,
        status: "completed",
        thumbnailUrl: v.videoThumbnailUrl,
        videoThumbnailUrl: v.videoThumbnailUrl,
        videoDuration: v.videoDuration,
        videoUrl: v.videoUrl,
        eventType: "video",
        location: "Nellore & Hyderabad",
        startDate: ts,
        endDate: ts,
        registrationDeadline: ts,
        totalSeats: 0,
        registeredCount: 0,
        isRegistrationOpen: false,
        isFeatured: true,
        organizer: "VidyaVaidya Charity Trust",
        speakers: [],
        tags: ["video", "gallery", "documentary"],
        isPublished: true,
        createdAt: ts,
        updatedAt: ts,
        publishedAt: ts
      };

      videoBatch.set(docRef, eventDoc, { merge: true });
      console.log(`  ➕ Added video document: ${v.title}`);
    }

    await videoBatch.commit();
    console.log("🎉 Seeding completed successfully! All gallery photo assets and video gallery pages are fully stored in Firestore!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
  process.exit(0);
}

run();
