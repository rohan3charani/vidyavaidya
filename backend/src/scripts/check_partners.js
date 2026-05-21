const { db } = require('../config/firebase');

async function check() {
  try {
    console.log("Fetching partners...");
    const snap = await db.collection('partners').get();
    if (snap.empty) {
      console.log("No partners found in DB.");
      return;
    }
    snap.forEach(doc => {
      console.log("-----------------------------------------");
      console.log("ID:", doc.id);
      const data = doc.data();
      console.log("Name:", data.name);
      console.log("Slug:", data.slug);
      console.log("Type:", data.type);
      console.log("LogoUrl exists:", !!data.logoUrl);
      console.log("CoverImageUrl exists:", !!data.coverImageUrl);
      console.log("GalleryUrls:", data.galleryUrls);
      console.log("GalleryImages:", data.galleryImages);
      console.log("All data:", JSON.stringify(data, null, 2));
    });
  } catch (error) {
    console.error("Error checking partners:", error);
  }
}

check();
