import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Pages.css";

const articleImages = import.meta.glob("../assets/articles/*.{jpg,png,jpeg}", { eager: true });
const images = Object.values(articleImages).map((module) => module.default);

// Split images into two halves
const midPoint = Math.ceil(images.length / 2);
const firstHalf = images.slice(0, midPoint);
const secondHalf = images.slice(midPoint);

export default function News() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="page-wrapper bg-slate-50 min-h-screen font-sans">
      <Navbar />

      {/* Modern Hero Section with Green/Blue Gradient */}
      <section className="relative pt-40 pb-24 px-6 lg:px-20 overflow-hidden bg-gradient-to-br from-green-600 via-teal-700 to-blue-900 text-white">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-cyan-400/20 blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center mt-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs md:text-sm font-semibold tracking-widest uppercase mb-6 shadow-xl">
            Latest Coverage
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            In The <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-cyan-300">Press</span>
          </h1>
          <p className="text-lg md:text-xl text-teal-50 max-w-2xl mx-auto leading-relaxed">
            Explore our collection of news articles, media features, and stories documenting VidyaVaidya's impact across communities.
          </p>
        </div>
      </section>

      {/* First Half: Standard Grid (Previous Style) */}
      <section className="py-16 px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-slate-800 text-center relative pb-4">
            Recent Articles
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-teal-500 rounded-full"></span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {firstHalf.map((src, index) => (
              <div 
                key={index} 
                className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl border border-slate-100 bg-white cursor-pointer transition-all duration-300"
                onClick={() => setSelectedIndex(index)}
              >
                <img 
                  src={src} 
                  alt={`Recent Article ${index + 1}`} 
                  className="w-full h-auto block transform group-hover:scale-105 transition-transform duration-500 ease-in-out" 
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-teal-900/0 group-hover:bg-teal-900/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white font-medium px-4 py-2 bg-black/50 rounded-full backdrop-blur-sm transition-opacity duration-300 shadow-lg transform scale-90 group-hover:scale-100">
                    View Full Image
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second Half: Masonry Gallery (Modern Style) */}
      <section className="py-16 px-6 lg:px-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-slate-800 text-center relative pb-4">
            Article Archives
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-teal-500 rounded-full"></span>
          </h2>
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {secondHalf.map((src, index) => (
              <div 
                key={index} 
                className="group relative break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-200 bg-white"
                onClick={() => setSelectedIndex(midPoint + index)}
              >
                {/* Image */}
                <img 
                  src={src} 
                  alt={`Archive Article ${index + 1}`} 
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  loading="lazy"
                />
                
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <p className="text-white font-bold text-xl drop-shadow-md">Archive Feature {index + 1}</p>
                  <span className="text-teal-200 text-sm mt-2 font-medium flex items-center gap-2">
                    View Image <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Image Modal Popup */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8 transition-opacity duration-300"
          onClick={() => setSelectedIndex(null)}
        >
          <div 
            className="relative max-w-6xl w-full max-h-full flex items-center justify-center transform transition-transform duration-300 scale-100 animate-in fade-in zoom-in-95" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            <button 
              className="absolute left-0 md:-left-16 lg:-left-24 text-white/50 hover:text-white transition-colors p-4 rounded-full hover:bg-white/10 z-10"
              onClick={handlePrev}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Close Button */}
            <button 
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors p-2 z-10"
              onClick={() => setSelectedIndex(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Main Image */}
            <img 
              src={images[selectedIndex]} 
              alt={`Full Size View ${selectedIndex + 1}`} 
              className="max-w-full max-h-[85vh] object-contain shadow-2xl" 
            />

            {/* Next Button */}
            <button 
              className="absolute right-0 md:-right-16 lg:-right-24 text-white/50 hover:text-white transition-colors p-4 rounded-full hover:bg-white/10 z-10"
              onClick={handleNext}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-white/70 font-medium tracking-wide">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
