import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

// Categories and Data Setup
const categories = ["All", "Education", "Health", "Community Trust", "Empowerment", "Volunteers"];

const rawImages = import.meta.glob("../assets/images/*.{jpg,png,jpeg}", { eager: true });
const imageUrls = Object.values(rawImages).map((module) => module.default);

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

// Map all 200+ images dynamically
const galleryPhotos = imageUrls.map((url, index) => {
  const catIndex = (index * 7) % (categories.length - 1) + 1; // skip "All"
  return {
    id: index + 1,
    category: categories[catIndex],
    title: titles[index % titles.length],
    description: descriptions[index % descriptions.length],
    image: url,
    alt: `Trust Gallery Photo ${index + 1}`
  };
});

export default function PhotoGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredPhotos = useMemo(
    () =>
      activeCategory === "All"
        ? galleryPhotos
        : galleryPhotos.filter((photo) => photo.category === activeCategory),
    [activeCategory]
  );

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  useEffect(() => {
    if (lightboxIndex !== null) {
      const onKeyDown = (event) => {
        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowRight") {
          setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length);
        }
        if (event.key === "ArrowLeft") {
          setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
        }
      };

      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);

      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [lightboxIndex, filteredPhotos.length]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <div style={{ display: lightboxIndex !== null ? 'none' : 'block' }}>
        <Navbar />
      </div>

      <main className="flex-grow">
        {/* Header Section */}
        <section className="relative pt-32 pb-24 px-6 lg:px-20 overflow-hidden bg-gradient-to-br from-green-600 via-teal-700 to-blue-900 text-white min-h-[40vh] flex items-center justify-center">
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 blur-[120px]"></div>
            <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-cyan-400/20 blur-[120px]"></div>
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center text-center">
            <div className="mx-auto max-w-3xl space-y-6">
              <span className="inline-flex rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200">
                VidyaVaidya Charity Trust
              </span>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-cyan-300">Education</span>, Nurturing <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-cyan-300">Health</span>
              </h1>
              <p className="mx-auto max-w-2xl text-base text-teal-50 sm:text-xl font-medium italic mt-4">
                "Building a foundation of trust through charitable action. Witness the moments where healthcare and learning unite to transform lives."
              </p>
            </div>
          </div>
        </section>

        {/* Categories Navigation */}
        <section className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50/95 backdrop-blur-xl shadow-sm">
          <div className="mx-auto flex max-w-7xl overflow-x-auto items-center justify-start lg:justify-center gap-3 px-6 py-4 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-teal-700 text-white shadow-lg shadow-teal-700/30 transform scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Creative Masonry Gallery */}
        <section className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700 mb-2">Our Impact</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Moments of <span className="text-teal-600">Trust</span>
            </h2>
          </div>

          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {filteredPhotos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => openLightbox(index)}
                className="group relative w-full break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl block text-left border border-slate-100"
                aria-label={`Open ${photo.title} in lightbox`}
              >
                <div className="relative overflow-hidden w-full">
                  <img
                    src={photo.image}
                    alt={photo.alt}
                    loading="lazy"
                    className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  {/* Dark elegant gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  {/* Hover Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 opacity-0 transition-all duration-500 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0">
                    <span className="inline-block px-2.5 py-1 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-900 bg-teal-200/90 rounded-full backdrop-blur-sm">
                      {photo.category}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-snug mb-1">{photo.title}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2">{photo.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredPhotos.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              No photos found in this category.
            </div>
          )}
        </section>

        {/* Fullscreen Lightbox Modal */}
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 transition-opacity duration-300">
            {/* Close */}
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-4 md:right-8 top-4 md:top-8 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 hover:scale-110 focus:outline-none"
              aria-label="Close image lightbox"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left Nav */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
              }}
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 md:p-4 text-white transition hover:bg-white/20 hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Nav */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length);
              }}
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 md:p-4 text-white transition hover:bg-white/20 hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Main Image Container */}
            <div className="relative mx-auto flex flex-col items-center max-w-6xl w-full max-h-[90vh]">
              <img
                src={filteredPhotos[lightboxIndex].image}
                alt={filteredPhotos[lightboxIndex].alt}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="w-full text-center mt-6 space-y-2 px-4">
                <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-teal-300 bg-teal-900/50 rounded-full">
                  {filteredPhotos[lightboxIndex].category}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  {filteredPhotos[lightboxIndex].title}
                </h3>
                <p className="max-w-2xl mx-auto text-sm md:text-base text-slate-300">
                  {filteredPhotos[lightboxIndex].description}
                </p>
                <div className="text-white/40 text-xs tracking-widest mt-4">
                  {lightboxIndex + 1} / {filteredPhotos.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
