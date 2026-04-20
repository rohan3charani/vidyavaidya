import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const categories = ["All", "Education", "Health", "Events", "Volunteers", "Impact Stories"];

const galleryPhotos = [
  {
    id: 1,
    category: "Education",
    title: "First Day of School Smiles",
    description: "New uniforms, fresh notebooks, and hopeful hearts ready for learning.",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200&q=80",
    alt: "Children smiling in school uniforms"
  },
  {
    id: 2,
    category: "Health",
    title: "Nutrition Camp in Action",
    description: "Volunteers and health workers bringing care to families in need.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80",
    alt: "Doctor checking child's health"
  },
  {
    id: 3,
    category: "Events",
    title: "Community Celebration Day",
    description: "A neighborhood festival celebrating growth, learning, and togetherness.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80",
    alt: "Community gathering during event"
  },
  {
    id: 4,
    category: "Volunteers",
    title: "Mentorship Circle",
    description: "Volunteers guiding children through after-school learning circles.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
    alt: "Volunteer mentoring a child"
  },
  {
    id: 5,
    category: "Impact Stories",
    title: "From Street to School",
    description: "A journey of courage, resilience, and a new chapter of education.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80",
    alt: "Child walking into school"
  },
  {
    id: 6,
    category: "Health",
    title: "Vaccination Drive",
    description: "Healthy futures start with accessible healthcare for every child.",
    image: "https://images.unsplash.com/photo-1580281657527-0a6d1b8cdbbb?w=1200&q=80",
    alt: "Healthcare workers vaccinating children"
  },
  {
    id: 7,
    category: "Education",
    title: "Learning Beyond Classrooms",
    description: "Hands-on lessons that build confidence and real-world skills.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80",
    alt: "Child engaged in a learning activity"
  },
  {
    id: 8,
    category: "Events",
    title: "Harvest Festival Outreach",
    description: "A joyful day of empowerment, community, and shared stories.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
    alt: "People celebrating outdoors"
  }
];

const galleryVideos = [
  {
    id: 1,
    title: "Hope in Every Step",
    description: "A short film documenting our journey with children and families.",
    thumb: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80",
    embed: "https://www.youtube.com/embed/ScMzIvxBSi4"
  },
  {
    id: 2,
    title: "The Health Outreach Story",
    description: "Behind the scenes of a rural medical camp that changed lives.",
    thumb: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900&q=80",
    embed: "https://www.youtube.com/embed/2Vv-BfVoq4g"
  },
  {
    id: 3,
    title: "Volunteers Building Change",
    description: "Real people giving time, care, and hope across communities.",
    thumb: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=80",
    embed: "https://www.youtube.com/embed/3fumBcKC6RE"
  }
];

const featuredStories = [
  {
    id: 1,
    label: "Impact Story",
    title: "From Street to School",
    description: "How one child's confidence grew after joining our education program.",
    image: "https://images.unsplash.com/photo-1544717305-996b815c338c?w=1000&q=80",
    cta: "Read More",
    link: "/news"
  },
  {
    id: 2,
    label: "Volunteer Story",
    title: "A Doctor's Promise",
    description: "A volunteer nurse shares her moment of connection in a health camp.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1000&q=80",
    cta: "Watch Story",
    link: "/VideoGallery"
  }
];

export default function PhotoGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const photoSectionRef = useRef(null);
  const videoSectionRef = useRef(null);

  const filteredPhotos = useMemo(
    () =>
      activeCategory === "All"
        ? galleryPhotos
        : galleryPhotos.filter((photo) => photo.category === activeCategory),
    [activeCategory]
  );

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const openVideoModal = (video) => setActiveVideo(video);
  const closeVideoModal = () => setActiveVideo(null);

  useEffect(() => {
    if (lightboxIndex !== null || activeVideo) {
      const onKeyDown = (event) => {
        if (event.key === "Escape") closeLightbox() || closeVideoModal();
        if (event.key === "ArrowRight" && lightboxIndex !== null) {
          setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length);
        }
        if (event.key === "ArrowLeft" && lightboxIndex !== null) {
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
  }, [activeVideo, lightboxIndex, filteredPhotos.length]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="space-y-16">
        <section
          className="relative overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1511450674383-91ba2a7d5dcd?w=1600&q=90')"
          }}
        >
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
          <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-6 py-24 text-center text-white sm:px-10 lg:px-16">
            <div className="mx-auto max-w-3xl space-y-6">
              <span className="inline-flex rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200">
                Moments That Matter
              </span>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Capturing smiles, stories, and transformations
              </h1>
              <p className="mx-auto max-w-2xl text-base text-slate-200 sm:text-lg">
                Explore the impact of VidyaVaidya through images and videos that celebrate learning, health, and community.
              </p>
              <div className="mx-auto flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => photoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  View Photos
                </button>
                <button
                  type="button"
                  onClick={() => videoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  Watch Videos
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="sticky top-24 z-20 border-b border-slate-200 bg-slate-50/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-6 py-4 sm:px-10">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                  activeCategory === category
                    ? "bg-emerald-700 text-white shadow-lg shadow-emerald-200/30"
                    : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section ref={photoSectionRef} className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-16">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Photo Gallery</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Beautiful moments of learning, care, and community.
              </h2>
              <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
                Filter the gallery to explore how VidyaVaidya brings impact through education, health, events, volunteer action, and heartfelt stories.
              </p>
            </div>
            <p className="text-sm text-slate-500">Showing {filteredPhotos.length} of {galleryPhotos.length} photos</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPhotos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => openLightbox(index)}
                className="group overflow-hidden rounded-[32px] bg-white shadow-lg shadow-slate-200 transition duration-500 hover:-translate-y-1 hover:shadow-emerald-200/60"
                aria-label={`Open ${photo.title} in lightbox`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={photo.image}
                    alt={photo.alt}
                    loading="lazy"
                    className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 transition duration-500 group-hover:opacity-100">
                    <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">{photo.category}</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{photo.title}</h3>
                  </div>
                </div>
                <div className="space-y-2 px-6 py-5 text-left">
                  <p className="text-sm text-slate-600">{photo.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4">
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-slate-900/90 text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              aria-label="Close image lightbox"
            >
              ×
            </button>

            <button
              type="button"
              onClick={() => setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white transition hover:bg-white/20"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white transition hover:bg-white/20"
              aria-label="Next image"
            >
              ›
            </button>

            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[36px] bg-slate-900 shadow-2xl shadow-slate-950/60">
              <img
                src={filteredPhotos[lightboxIndex].image}
                alt={filteredPhotos[lightboxIndex].alt}
                className="h-[70vh] w-full object-cover"
              />
              <div className="space-y-3 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent px-6 py-7 text-white">
                <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">{filteredPhotos[lightboxIndex].category}</p>
                <h3 className="text-2xl font-semibold">{filteredPhotos[lightboxIndex].title}</h3>
                <p className="max-w-2xl text-sm text-slate-200">{filteredPhotos[lightboxIndex].description}</p>
              </div>
            </div>
          </div>
        )}

        <section ref={videoSectionRef} className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-16">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Video Stories</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Watch the spirit of our community come alive.
              </h2>
              <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
                These videos highlight the people, programs, and moments that shape VidyaVaidya’s mission.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {galleryVideos.map((video) => (
              <button
                key={video.id}
                type="button"
                onClick={() => openVideoModal(video)}
                className="group overflow-hidden rounded-[32px] bg-white shadow-lg shadow-slate-200 transition duration-500 hover:-translate-y-1 hover:shadow-emerald-200/40"
              >
                <div className="relative overflow-hidden">
                  <img src={video.thumb} alt={video.title} loading="lazy" className="h-64 w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-slate-950/30" />
                  <div className="absolute inset-x-0 bottom-4 flex justify-center">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-2xl text-emerald-700 shadow-lg shadow-slate-900/20 transition group-hover:scale-110">
                      ▶
                    </span>
                  </div>
                </div>
                <div className="space-y-2 px-6 py-6 text-left">
                  <p className="text-xs uppercase tracking-[0.24em] text-emerald-600">Video</p>
                  <h3 className="text-xl font-semibold text-slate-900">{video.title}</h3>
                  <p className="text-sm text-slate-500">{video.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4">
            <button
              type="button"
              onClick={closeVideoModal}
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-slate-900/90 text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              aria-label="Close video modal"
            >
              ×
            </button>
            <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[32px] bg-slate-950 shadow-2xl shadow-slate-950/70">
              <div className="relative aspect-video bg-black">
                <iframe
                  src={activeVideo.embed}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
              <div className="space-y-3 bg-slate-900 px-6 py-6 text-white">
                <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Video Story</p>
                <h3 className="text-2xl font-semibold">{activeVideo.title}</h3>
                <p className="text-sm text-slate-300">{activeVideo.description}</p>
              </div>
            </div>
          </div>
        )}

        <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-16">
          <div className="grid gap-6 lg:grid-cols-2">
            {featuredStories.map((story) => (
              <article
                key={story.id}
                className="group overflow-hidden rounded-[32px] bg-white shadow-xl shadow-slate-200 transition hover:-translate-y-1"
              >
                <div className="relative h-80 overflow-hidden">
                  <img src={story.image} alt={story.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <span className="absolute left-6 top-6 rounded-full bg-emerald-600/90 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white">
                    {story.label}
                  </span>
                </div>
                <div className="space-y-4 px-6 py-8">
                  <h3 className="text-2xl font-semibold text-slate-900">{story.title}</h3>
                  <p className="text-sm text-slate-600">{story.description}</p>
                  <Link
                    to={story.link}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
                  >
                    {story.cta}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-emerald-700 via-slate-900 to-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Join the movement</p>
                <h2 className="text-4xl font-semibold tracking-tight">Be a Part of Their Story</h2>
                <p className="max-w-2xl text-base text-slate-200 sm:text-lg">
                  Your support helps us create safe learning spaces, provide medical care, and build lasting community resilience.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/donate"
                  className="inline-flex min-w-[160px] items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
                >
                  Donate Now
                </Link>
                <Link
                  to="/join-community"
                  className="inline-flex min-w-[160px] items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Volunteer With Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
