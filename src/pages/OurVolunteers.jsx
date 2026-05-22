import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import api from '../services/api';
import './Pages.css';

export default function OurVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const data = await api.partners.list();
        const filtered = (data || []).filter(p => p.type === "government" && p.isActive !== false);
        setVolunteers(filtered);
      } catch (err) {
        console.error("Failed to fetch volunteers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteers();
  }, []);

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="flex-grow">
        {/* Header Section */}
        <section className="page-hero">
          <div className="relative z-10">
            <span className="page-hero-tag">Our Heroes</span>
            <h1>Meet Our Volunteers</h1>
            <p>
              "Volunteering is at the very core of being a human. No one has made it through life without someone else's help."
            </p>
          </div>
        </section>

        {/* Volunteers Grid */}
        <section className="py-20 px-6 lg:px-20 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
              <p className="mt-4 text-slate-500 font-semibold">Loading volunteers...</p>
            </div>
          ) : volunteers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm max-w-md mx-auto">
              <span className="text-5xl block mb-4">👥</span>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Volunteers Registered</h3>
              <p className="text-slate-500 text-sm">We are currently expanding our volunteer network. Please check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {volunteers.map((v, i) => (
                <div 
                  key={i} 
                  className="group flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-2xl bg-slate-100">
                    {v.logoUrl ? (
                      <img 
                        src={v.logoUrl} 
                        alt={v.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl bg-emerald-50 text-emerald-600 font-bold">👤</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-md font-bold text-slate-800 text-center leading-tight group-hover:text-emerald-600 transition-colors duration-300">
                    {v.name}
                  </h3>
                  <span className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Volunteer</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-white border-t border-slate-100 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Want to Join Us?</h2>
            <p className="text-slate-600 mb-10 leading-relaxed">
              Your time and skills can make a world of difference. Join our growing community of volunteers and help us bring hope to those who need it most.
            </p>
            <a 
              href="/join/volunteer" 
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Become a Volunteer
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

