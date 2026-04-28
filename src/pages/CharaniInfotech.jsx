import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import EntranceImg from '../assets/Partners/CORPORATE SPONSOR/Charani Infotech/Entrance.JPG';
import InsideImg from '../assets/Partners/CORPORATE SPONSOR/Charani Infotech/Inside1.JPG';
import NamePlateImg from '../assets/Partners/CORPORATE SPONSOR/Charani Infotech/Name plate.JPG';
import RajsekharImg from '../assets/Partners/CORPORATE SPONSOR/Charani Infotech/Rajsekhar.JPG';
import { Link } from 'react-router-dom';

export default function CharaniInfotech() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-20 overflow-hidden bg-gradient-to-br from-indigo-800 via-purple-900 to-slate-900 text-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-400/20 blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/3 flex justify-center w-full">
            <div className="bg-white p-4 rounded-3xl shadow-2xl w-full flex justify-center items-center overflow-hidden">
              <img src={EntranceImg} alt="Charani Infotech Entrance" className="w-full h-auto object-cover max-h-64 rounded-2xl hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
          <div className="md:w-2/3 text-center md:text-left">
            <span className="inline-flex rounded-full bg-indigo-500/30 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-indigo-200 mb-6">
              Official Tech Partner
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">CHARANI INFOTECH</h1>
            <p className="text-xl text-indigo-200 font-medium mb-6">Led by CEO G.Rajsekhar</p>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto md:mx-0">
              A leader in technological innovation, Charani Infotech stands as a proud corporate sponsor of VidyaVaidya Trust, providing vital digital resources and unwavering support to our mission of education and empowerment.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-6 lg:px-20 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <svg className="w-16 h-16 mx-auto text-indigo-400 mb-6 opacity-30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <h2 className="text-3xl font-bold text-slate-800 mb-8">A Message of Support</h2>
          <blockquote className="text-2xl md:text-3xl font-medium text-slate-600 leading-relaxed italic mb-8">
            "At Charani Infotech, we believe that technology should be a force for good. We are incredibly proud to sponsor the VidyaVaidya Trust. Their dedication to bridging gaps in education and healthcare aligns perfectly with our core values. We are committed to supporting their digital transformation and helping them scale their impact."
          </blockquote>
          <div className="flex flex-col items-center justify-center mt-10">
            <img src={RajsekharImg} alt="CEO G.Rajsekhar" className="w-24 h-24 rounded-full object-cover mb-4 shadow-lg border-4 border-indigo-50" />
            <p className="text-xl font-bold text-slate-900">G. Rajsekhar</p>
            <p className="text-indigo-600 font-semibold uppercase tracking-wider text-sm mt-1">CEO, Charani Infotech</p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-6 lg:px-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Partner Highlights</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">A look inside our collaborative tech partner driving innovation for social good.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 bg-white">
              <div className="relative overflow-hidden aspect-[4/3] bg-slate-100 flex items-center justify-center">
                <img src={InsideImg} alt="Charani Infotech Inside" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <p className="text-white font-bold text-2xl mb-2">Innovative Workspace</p>
                  <p className="text-indigo-200 font-medium">Where technology meets social impact.</p>
                </div>
              </div>
            </div>
            <div className="group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 bg-white">
              <div className="relative overflow-hidden aspect-[4/3] bg-slate-100 flex items-center justify-center">
                <img src={NamePlateImg} alt="Charani Infotech Name Plate" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <p className="text-white font-bold text-2xl mb-2">Corporate Excellence</p>
                  <p className="text-indigo-200 font-medium">A trusted name in IT solutions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-slate-900 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Network of Change-Makers</h2>
        <p className="text-indigo-200 max-w-2xl mx-auto text-lg mb-10">We are always looking for passionate corporate sponsors to empower communities through technology.</p>
        <Link to="/join-community" className="inline-block bg-indigo-500 text-white font-bold px-8 py-4 rounded-full hover:bg-indigo-400 hover:scale-105 transition-all shadow-xl">
          Become a Sponsor
        </Link>
      </section>

      <Footer />
    </div>
  );
}
