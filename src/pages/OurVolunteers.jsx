import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

// Importing volunteer images
import Vol1 from '../assets/Volunteers/Sk.Raffi.jpeg';
import Vol2 from '../assets/Volunteers/B.Janaki RamiReddy.jpeg';
import Vol3 from '../assets/Volunteers/T.Hazarathaiah.jpeg';
import Vol4 from '../assets/Volunteers/T.Kumar.jpeg';
import Vol5 from '../assets/Volunteers/T.Rajeswara Rao.jpeg';
import Vol6 from '../assets/Volunteers/M.Sanjeev Reddy.jpeg';
import Vol7 from '../assets/Volunteers/B.Venkatesh Chowdary.jpeg';
import Vol8 from '../assets/Volunteers/Sk.Taju Tarak.jpeg';
import Vol9 from '../assets/Volunteers/V.Anil.jpeg';
import Vol10 from '../assets/Volunteers/P.Srinivasulu Reddy.jpeg';
import Vol11 from '../assets/Volunteers/P.Ravi Chandra Sekhar.jpeg';
import Vol12 from '../assets/Volunteers/M.Venu.jpeg';
import Vol13 from '../assets/Volunteers/Sk.Hydarshaa.jpeg';
import Vol14 from '../assets/Volunteers/Sk.Khajamohiddin.jpeg';
import Vol15 from '../assets/Volunteers/K.Venkat Kishor.jpeg';

const VOLUNTEERS = [
  { name: "Sk. Raffi", img: Vol1 },
  { name: "B. Janaki RamiReddy", img: Vol2 },
  { name: "T. Hazarathaiah", img: Vol3 },
  { name: "T. Kumar", img: Vol4 },
  { name: "T. Rajeswara Rao", img: Vol5 },
  { name: "M. Sanjeev Reddy", img: Vol6 },
  { name: "B. Venkatesh Chowdary", img: Vol7 },
  { name: "Sk. Taju Tarak", img: Vol8 },
  { name: "V. Anil", img: Vol9 },
  { name: "P. Srinivasulu Reddy", img: Vol10 },
  { name: "P. Ravi Chandra Sekhar", img: Vol11 },
  { name: "M. Venu", img: Vol12 },
  { name: "Sk. Hydarshaa", img: Vol13 },
  { name: "Sk. Khajamohiddin", img: Vol14 },
  { name: "K. Venkat Kishor", img: Vol15 },
];

export default function OurVolunteers() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Header Section */}
        <section className="relative pt-32 pb-24 px-6 lg:px-20 overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-green-900 text-white text-center">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 blur-[120px]"></div>
            <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-cyan-400/20 blur-[120px]"></div>
          </div>
          
          <div className="relative z-10">
            <span className="inline-flex rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-100 mb-6">Our Heroes</span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">Meet Our Volunteers</h1>
            <p className="mx-auto max-w-2xl text-base text-emerald-50 sm:text-xl font-medium italic">
              "Volunteering is at the very core of being a human. No one has made it through life without someone else's help."
            </p>
          </div>
        </section>

        {/* Volunteers Grid */}
        <section className="py-20 px-6 lg:px-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {VOLUNTEERS.map((v, i) => (
              <div 
                key={i} 
                className="group flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-2xl bg-slate-100">
                  <img 
                    src={v.img} 
                    alt={v.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-md font-bold text-slate-800 text-center leading-tight group-hover:text-emerald-600 transition-colors duration-300">
                  {v.name}
                </h3>
                <span className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Volunteer</span>
              </div>
            ))}
          </div>
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
