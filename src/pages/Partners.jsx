import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
import { HeartPulse, LaptopMinimal, HandHeart, GraduationCap, Building2 } from "lucide-react";
import api from "../services/api";

export default function Partners() {
  const staticPartners = [
    {
      id: "s1",
      name: "Global Health Care",
      type: "Hospital Network",
      logo: HeartPulse,
      link: "/partners/global-health-care"
    },
    {
      id: "s2",
      name: "Tech For Good Inc.",
      type: "Corporate Network",
      logo: LaptopMinimal,
      link: "/partners/tech-for-good"
    },
    { id: "s3", name: "Our Volunteers", type: "Volunteers", logo: HandHeart, link: "/Ourvolunteers" },
    { id: "s5", name: "Education Support", type: "Corporate", logo: GraduationCap, link: "/EducationSupport" },
    { id: "s6", name: "NGO", type: "NGO", logo: Building2, link: "/NGO" }
  ];

  const [dynamicPartners, setDynamicPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const list = await api.partners.list();
        const typeMappings = {
          hospital: { type: "Hospital Network", logo: HeartPulse },
          ngo: { type: "NGO", logo: Building2 },
          educational: { type: "Educational Institution", logo: GraduationCap },
          corporate: { type: "Corporate Partner", logo: LaptopMinimal },
          government: { type: "Volunteer Network", logo: HandHeart }
        };

        const filteredList = (list || []).filter(item => 
          item.type !== "hospital" && 
          item.type !== "corporate" && 
          item.type !== "government" &&
          item.type !== "educational" &&
          item.type !== "ngo"
        );

        const mapped = filteredList.map(item => {
          const mapping = typeMappings[item.type] || { type: item.type || "Partner", logo: Building2 };
          return {
            id: item.id || item.partnerId,
            name: item.name,
            type: mapping.type,
            imgLogo: item.logoUrl || null,
            logo: mapping.logo,
            link: item.slug ? `/partners/${item.slug}` : (item.website || null)
          };
        });
        setDynamicPartners(mapped);
      } catch (err) {
        console.error("Failed to load dynamic partners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const displayPartners = [
    ...dynamicPartners,
    ...staticPartners.filter(sp => !dynamicPartners.some(dp => dp.name.toLowerCase() === sp.name.toLowerCase()))
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
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-650"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPartners.map(p => {
                const isExternal = p.link && (p.link.startsWith("http://") || p.link.startsWith("https://"));
                const cardContent = (
                  <>
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
                  </>
                );

                if (p.link) {
                  if (isExternal) {
                    return (
                      <a 
                        href={p.link} 
                        key={p.id} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                      >
                        {cardContent}
                      </a>
                    );
                  } else {
                    return (
                      <Link 
                        to={p.link} 
                        key={p.id} 
                        className="group flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                      >
                        {cardContent}
                      </Link>
                    );
                  }
                } else {
                  return (
                    <div key={p.id} className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
                      {p.imgLogo ? (
                        <img src={p.imgLogo} alt={p.name} className="h-28 w-auto object-contain mb-8" />
                      ) : (
                        (() => {
                          const IconComponent = p.logo;
                          return (
                            <IconComponent 
                              className="w-16 h-16 text-[#0F172A] hover:text-[#10B981] mb-8 transition-all duration-350 transform hover:scale-105" 
                              strokeWidth={1.5}
                            />
                          );
                        })()
                      )}
                      <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">{p.name}</h3>
                      <div className="mt-auto pt-4 w-full flex justify-center border-t border-slate-100">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-50 px-4 py-1.5 rounded-full">{p.type}</span>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
