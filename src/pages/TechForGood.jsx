import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import api from "../services/api";

export default function TechForGood() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const data = await api.partners.list();
        const filtered = (data || []).filter(p => p.type === "corporate" && p.isActive !== false);
        setSponsors(filtered);
      } catch (err) {
        console.error("Failed to fetch sponsors:", err);
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
        <section className="relative pt-32 pb-24 px-6 lg:px-20 overflow-hidden bg-gradient-to-br from-green-600 via-teal-700 to-blue-900 text-white text-center">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 blur-[120px]"></div>
            <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-cyan-400/20 blur-[120px]"></div>
          </div>
          
          <div className="relative z-10">
            <span className="inline-flex rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200 mb-6">Corporate Network</span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">Tech For Good Inc.</h1>
            <p className="mx-auto max-w-2xl text-base text-teal-50 sm:text-xl font-medium italic mt-4">Discover the innovative tech companies operating under our Tech For Good partnership.</p>
          </div>
        </section>

        <section className="py-20 px-6 lg:px-20 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
              <p className="mt-4 text-slate-500 font-semibold">Loading sponsors...</p>
            </div>
          ) : sponsors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm max-w-md mx-auto">
              <span className="text-5xl block mb-4">💻</span>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Corporate Sponsors</h3>
              <p className="text-slate-500 text-sm">We are currently expanding our corporate network. Please check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sponsors.map(p => (
                <div key={p.id} className="group flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt={p.name} className="h-28 w-auto object-cover rounded-xl mb-8 group-hover:scale-110 transition-transform duration-500 shadow-md" />
                  ) : (
                    <span className="text-7xl mb-8 group-hover:scale-110 transition-transform duration-500 block drop-shadow-sm">💻</span>
                  )}
                  
                  <h3 className="text-2xl font-bold text-slate-800 mb-3 text-center">{p.name}</h3>
                  
                  {p.shortBio && (
                    <p className="text-slate-500 text-sm font-semibold text-center mb-6 leading-relaxed">
                      {p.shortBio}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-4 flex items-center justify-between w-full border-t border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full">Corporate</span>
                    {p.websiteUrl ? (
                      <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-500 font-bold hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                        Website <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    ) : (
                      <span className="text-slate-400 font-semibold text-xs">Official Partner</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

