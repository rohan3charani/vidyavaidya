import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import SairamLogo from '../assets/Partners/GLOBAL HEALTH CARE/SAIRAM HOSPITAL/1.png';
import SairamImg2 from '../assets/Partners/GLOBAL HEALTH CARE/SAIRAM HOSPITAL/2.png';
import SairamImg3 from '../assets/Partners/GLOBAL HEALTH CARE/SAIRAM HOSPITAL/3.png';
import { Link } from 'react-router-dom';

export default function SairamHospital() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-20 overflow-hidden bg-gradient-to-br from-green-700 via-teal-800 to-blue-900 text-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-cyan-400/20 blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/3 flex justify-center w-full">
            <div className="bg-white p-6 rounded-3xl shadow-2xl w-full flex justify-center items-center">
              <img src={SairamLogo} alt="Sairam Hospital Logo" className="w-full h-auto object-contain max-h-64" />
            </div>
          </div>
          <div className="md:w-2/3 text-center md:text-left">
            <span className="inline-flex rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200 mb-6">
              Official Medical Partner
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">SAIRAM HOSPITAL</h1>
            <p className="text-xl text-teal-100 font-medium mb-6">Led by Dr. LALITHA & Dr. SATHISH</p>
            <p className="text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto md:mx-0">
              A beacon of health and community care, Sairam Hospital stands as a proud partner of VidyaVaidya Trust, providing vital medical assistance and unwavering support to our mission of healing and empowerment.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-6 lg:px-20 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <svg className="w-16 h-16 mx-auto text-teal-500 mb-6 opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <h2 className="text-3xl font-bold text-slate-800 mb-8">A Message of Support</h2>
          <blockquote className="text-2xl md:text-3xl font-medium text-slate-600 leading-relaxed italic mb-8">
            "VidyaVaidya Trust has been doing phenomenal work in bringing healthcare and education to those who need it most. At Sairam Hospital, we strongly believe in their vision. It is our privilege to partner with them, providing medical care and resources to ensure that every individual has access to a healthier, brighter future."
          </blockquote>
          <div className="flex flex-col items-center justify-center mt-10">
            <div className="w-16 h-1 bg-teal-500 rounded-full mb-4"></div>
            <p className="text-xl font-bold text-slate-900">Dr. LALITHA & Dr. SATHISH</p>
            <p className="text-teal-600 font-semibold uppercase tracking-wider text-sm mt-1">Founders, SAIRAM HOSPITAL</p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-6 lg:px-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Partner Highlights</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Glimpses of our collaborative efforts and the state-of-the-art facilities at Sairam Hospital.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 bg-white">
              <div className="relative overflow-hidden aspect-[4/3] bg-slate-100 flex items-center justify-center">
                <img src={SairamImg2} alt="Sairam Hospital Facility 1" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <p className="text-white font-bold text-2xl mb-2">State of the Art Facilities</p>
                  <p className="text-teal-200 font-medium">Equipped for comprehensive medical care.</p>
                </div>
              </div>
            </div>
            <div className="group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 bg-white">
              <div className="relative overflow-hidden aspect-[4/3] bg-slate-100 flex items-center justify-center">
                <img src={SairamImg3} alt="Sairam Hospital Facility 2" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <p className="text-white font-bold text-2xl mb-2">Compassionate Care</p>
                  <p className="text-teal-200 font-medium">Dedicated to community wellness.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-teal-900 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Network of Change-Makers</h2>
        <p className="text-teal-100 max-w-2xl mx-auto text-lg mb-10">We are always looking for passionate medical institutions and corporate sponsors to expand our reach.</p>
        <Link to="/join-community" className="inline-block bg-emerald-400 text-teal-950 font-bold px-8 py-4 rounded-full hover:bg-emerald-300 hover:scale-105 transition-all shadow-xl">
          Become a Partner
        </Link>
      </section>

      <Footer />
    </div>
  );
}
