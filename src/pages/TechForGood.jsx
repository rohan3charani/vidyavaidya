import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
import CharaniLogo from "../assets/Partners/CORPORATE SPONSOR/Charani Infotech/Entrance.JPG";

export default function TechForGood() {
  const sponsors = [
    { 
      id: "charani", 
      name: "CHARANI INFOTECH", 
      type: "Corporate Sponsor", 
      imgLogo: CharaniLogo,
      doctors: ["CEO G.Rajsekhar"],
      link: "/partners/charani-infotech"
    }
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sponsors.map(p => (
              <Link to={p.link} key={p.id} className="group flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                {p.imgLogo ? (
                  <img src={p.imgLogo} alt={p.name} className="h-28 w-auto object-cover rounded-xl mb-8 group-hover:scale-110 transition-transform duration-500 shadow-md" />
                ) : (
                  <span className="text-7xl mb-8 group-hover:scale-110 transition-transform duration-500 block drop-shadow-sm">💻</span>
                )}
                
                <h3 className="text-2xl font-bold text-slate-800 mb-3 text-center">{p.name}</h3>
                
                {p.doctors && (
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {p.doctors.map(doc => (
                      <span key={doc} className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
                        {doc}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="mt-auto pt-4 flex items-center justify-between w-full border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full">{p.type}</span>
                  <span className="text-emerald-500 font-bold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                    View Details <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
