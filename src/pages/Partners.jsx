import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
import { HeartPulse, LaptopMinimal, HandHeart, GraduationCap, Building2 } from "lucide-react";

export default function Partners() {
  const partners = [
    {
      id: 1,
      name: "Global Health Care",
      type: "Hospital Network",
      logo: HeartPulse,
      link: "/partners/global-health-care"
    },
    {
      id: 2,
      name: "Tech For Good Inc.",
      type: "Corporate Network",
      logo: LaptopMinimal,
      link: "/partners/tech-for-good"
    },
    { id: 3, name: "Our Volunteers", type: "Volunteers", logo: HandHeart, link: "/Ourvolunteers" },
    { id: 5, name: "Education Support", type: "Corporate", logo: GraduationCap, link: "/EducationSupport" },
    { id: 6, name: "NGO", type: "NGO", logo: Building2, link: "/NGO" }
  ];

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="flex-grow">
        <section className="page-hero">
          <div className="relative z-10">
            <span className="page-hero-tag">Collaborations</span>
            <h1>Our Trusted Partners</h1>
            <p>
              Together with our partners, we amplify our impact and reach thousands of underserved individuals. 
              We are deeply grateful for their continued support.
            </p>
          </div>
        </section>

        <section className="py-20 px-6 lg:px-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map(p => (
              p.link ? (
                <Link to={p.link} key={p.id} className="group flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  {p.imgLogo ? (
                    <img src={p.imgLogo} alt={p.name} className="h-28 w-auto object-contain mb-8 group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    (() => {
                      const IconComponent = p.logo;
                      return (
                        <IconComponent 
                          className="w-16 h-16 text-[#0F172A] group-hover:text-[#10B981] mb-8 transition-all duration-350 transform group-hover:scale-105" 
                          strokeWidth={1.5}
                        />
                      );
                    })()
                  )}

                  <h3 className="text-2xl font-bold text-slate-800 mb-3 text-center">{p.name}</h3>

                  {p.doctors && (
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {p.doctors.map(doc => (
                        <span key={doc} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                          {doc}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-4 flex items-center justify-between w-full border-t border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full">{p.type}</span>
                    <span className="text-emerald-500 font-bold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                      View <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </Link>
              ) : (
                <div key={p.id} className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
                  {(() => {
                    const IconComponent = p.logo;
                    return (
                      <IconComponent 
                        className="w-16 h-16 text-[#0F172A] hover:text-[#10B981] mb-8 transition-all duration-350 transform hover:scale-105" 
                        strokeWidth={1.5}
                      />
                    );
                  })()}
                  <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">{p.name}</h3>
                  <div className="mt-auto pt-4 w-full flex justify-center border-t border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-50 px-4 py-1.5 rounded-full">{p.type}</span>
                  </div>
                </div>
              )
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
