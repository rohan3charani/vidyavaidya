import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import api from "../services/api";
import { Link } from "react-router-dom";

// Static fallback card for Charani Infotech (shown when no dynamic data is available)
import EntranceImg from "../assets/Partners/CORPORATE SPONSOR/Charani Infotech/Entrance.JPG";

const STATIC_SPONSORS = [
  {
    id: "charani-infotech-static",
    slug: "charani-infotech",
    name: "CHARANI INFOTECH",
    shortBio: "Led by CEO G. Rajsekhar",
    description:
      "A leader in technological innovation, Charani Infotech provides vital digital resources and unwavering support to our mission of education and empowerment.",
    logoUrl: EntranceImg,
    location: { city: "Nellore", state: "Andhra Pradesh" },
    isFeatured: true,
    isStatic: true,
  },
];

export default function TechForGood() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const data = await api.partners.list();
        const filtered = (data || []).filter(
          (p) => p.type === "corporate" && p.isActive !== false
        );
        // If API returns results, use them; otherwise fall back to static list
        setSponsors(filtered.length > 0 ? filtered : STATIC_SPONSORS);
      } catch (err) {
        console.error("Failed to fetch sponsors:", err);
        setSponsors(STATIC_SPONSORS);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* ── Hero ── */}
        <section className="relative pt-32 pb-24 px-6 lg:px-20 overflow-hidden bg-gradient-to-br from-violet-700 via-purple-800 to-indigo-900 text-white text-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-violet-400/20 blur-[120px]" />
            <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-400/20 blur-[120px]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <span className="inline-flex rounded-full bg-violet-500/20 border border-violet-400/30 px-5 py-2 text-xs font-extrabold uppercase tracking-[0.24em] text-violet-200 mb-6">
              Corporate Network
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-5">
              Tech For Good Inc.
            </h1>
            <p className="mx-auto max-w-2xl text-base text-violet-100 sm:text-lg font-medium leading-relaxed">
              Discover the innovative tech companies and corporate sponsors
              partnering with VidyaVaidya Trust to drive meaningful change
              through technology and CSR.
            </p>

            {/* Breadcrumb */}
            <div className="mt-8">
              <Link
                to="/partners"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors group"
              >
                <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
                All Partners
              </Link>
            </div>
          </div>
        </section>

        {/* ── Partners Grid ── */}
        <section className="py-20 px-6 lg:px-20 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-violet-500 border-t-transparent" />
              <p className="mt-4 text-slate-500 font-semibold">Loading corporate partners...</p>
            </div>
          ) : sponsors.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-10 shadow-sm max-w-md mx-auto">
              <span className="text-6xl block mb-5">💻</span>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">No Corporate Sponsors</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                We are currently expanding our corporate network. Please check back soon!
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12 space-y-2">
                <p className="text-sm font-bold text-violet-600 uppercase tracking-widest">
                  {sponsors.length} Corporate Partner{sponsors.length > 1 ? "s" : ""} in Our Network
                </p>
                <h2 className="text-2xl font-extrabold text-slate-800">
                  Our Tech & Corporate Partners
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sponsors.map((p) => {
                  const city  = p.location?.city  || p.city  || "";
                  const state = p.location?.state || p.state || "";

                  return (
                    <Link
                      to={`/partners/${p.slug}`}
                      key={p.id}
                      className="group flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Hover gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />

                      {/* Logo / Cover area */}
                      <div className="relative z-10 flex flex-col items-center pt-10 pb-6 px-8">
                        {p.logoUrl ? (
                          <div className="w-28 h-28 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-md mb-5 group-hover:scale-105 transition-transform duration-500">
                            <img
                              src={p.logoUrl}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-7xl mb-5 group-hover:scale-110 transition-transform duration-500 block">
                            💻
                          </span>
                        )}

                        {/* Featured badge */}
                        {p.isFeatured && (
                          <span className="mb-3 inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-extrabold uppercase tracking-widest">
                            ⭐ Featured
                          </span>
                        )}

                        {/* Name */}
                        <h3 className="text-xl font-extrabold text-slate-800 text-center leading-tight mb-2">
                          {p.name}
                        </h3>

                        {/* Short bio */}
                        {p.shortBio && (
                          <p className="text-slate-500 text-sm font-medium text-center leading-relaxed line-clamp-2 mb-3">
                            {p.shortBio}
                          </p>
                        )}

                        {/* Description preview */}
                        {p.description && p.description !== p.shortBio && (
                          <p className="text-slate-400 text-xs text-center leading-relaxed line-clamp-2">
                            {p.description}
                          </p>
                        )}
                      </div>

                      {/* Footer strip */}
                      <div className="relative z-10 mt-auto px-8 pb-7 flex items-center justify-between w-full border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-extrabold uppercase tracking-widest text-violet-700 bg-violet-50 border border-violet-100 px-3 py-1 rounded-full">
                            Corporate
                          </span>
                          {(city || state) && (
                            <span className="text-[10px] text-slate-400 font-semibold">
                              📍 {[city, state].filter(Boolean).join(", ")}
                            </span>
                          )}
                        </div>
                        <span className="text-violet-500 font-bold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1 text-xs flex-shrink-0">
                          View Profile
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
