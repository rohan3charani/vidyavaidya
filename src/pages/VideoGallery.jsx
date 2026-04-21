import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const galleryVideos = [
  {
    id: 1,
    title: "Hope in Every Step",
    description: "A short film documenting our journey with children and families.",
    thumb: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80",
    embed: "https://www.youtube.com/embed/ScMzIvxBSi4",
    category: "Impact Story"
  },
  {
    id: 2,
    title: "The Health Outreach Story",
    description: "Behind the scenes of a rural medical camp that changed lives.",
    thumb: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900&q=80",
    embed: "https://www.youtube.com/embed/2Vv-BfVoq4g",
    category: "Health"
  },
  {
    id: 3,
    title: "Volunteers Building Change",
    description: "Real people giving time, care, and hope across communities.",
    thumb: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=80",
    embed: "https://www.youtube.com/embed/3fumBcKC6RE",
    category: "Volunteers"
  },
  {
    id: 4,
    title: "Impacting 10,000+ Lives in 2024",
    description: "Our annual review of the progress and impact we've made together.",
    thumb: "https://images.unsplash.com/photo-1494883759339-0b042055a4ee?w=900&q=80",
    embed: "https://www.youtube.com/embed/ScMzIvxBSi4",
    category: "Education"
  }
];

export default function VideoGallery() {
  const [activeVideo, setActiveVideo] = useState(null);

  const openVideoModal = (video) => setActiveVideo(video);
  const closeVideoModal = () => setActiveVideo(null);

  useEffect(() => {
    if (activeVideo) {
      const onKeyDown = (event) => {
        if (event.key === "Escape") closeVideoModal();
      };
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [activeVideo]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="space-y-16">
        <section
          className="relative overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492691523567-6170c8173091?w=1600&q=90')"
          }}
        >
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-center px-6 py-24 text-center text-white sm:px-10 lg:px-16">
            <div className="mx-auto max-w-3xl space-y-6">
              <span className="inline-flex rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Events
              </span>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Video Gallery
              </h1>
              <p className="mx-auto max-w-2xl text-base text-slate-300 sm:text-lg">
                Experience our journey through these moving stories and documentary highlights.
              </p>

            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-10 lg:px-16">
          <div className="mb-12 text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">Featured Stories</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Watch the spirit of our community come alive.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {galleryVideos.map((video) => (
              <button
                key={video.id}
                type="button"
                onClick={() => openVideoModal(video)}
                className="group relative overflow-hidden rounded-[32px] bg-slate-900 shadow-2xl transition duration-500 hover:-translate-y-2"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumb}
                    alt={video.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 transition-opacity group-hover:bg-slate-950/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-2xl text-emerald-700 shadow-xl transition-transform duration-500 group-hover:scale-125">
                      ▶
                    </span>
                  </div>
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-emerald-600/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      {video.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 p-6 text-left">
                  <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">{video.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2">{video.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={closeVideoModal}
            className="absolute right-6 top-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-white transition hover:bg-slate-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            aria-label="Close video modal"
          >
            ×
          </button>
          <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[32px] bg-slate-950 shadow-2xl shadow-emerald-900/20">
            <div className="relative aspect-video bg-black">
              <iframe
                src={activeVideo.embed}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <div className="space-y-3 bg-slate-900/50 p-8 text-white backdrop-blur-md">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-400">{activeVideo.category}</p>
              <h3 className="text-3xl font-semibold">{activeVideo.title}</h3>
              <p className="text-base text-slate-300">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
