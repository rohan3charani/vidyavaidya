import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import api from '../services/api';

// Fallback assets for static partners
import SairamLogo from '../assets/Partners/GLOBAL HEALTH CARE/SAIRAM HOSPITAL/1.png';
import SairamImg2 from '../assets/Partners/GLOBAL HEALTH CARE/SAIRAM HOSPITAL/2.png';
import SairamImg3 from '../assets/Partners/GLOBAL HEALTH CARE/SAIRAM HOSPITAL/3.png';

import EntranceImg from '../assets/Partners/CORPORATE SPONSOR/Charani Infotech/Entrance.JPG';
import InsideImg from '../assets/Partners/CORPORATE SPONSOR/Charani Infotech/Inside1.JPG';
import NamePlateImg from '../assets/Partners/CORPORATE SPONSOR/Charani Infotech/Name plate.JPG';
import RajsekharImg from '../assets/Partners/CORPORATE SPONSOR/Charani Infotech/Rajsekhar.JPG';

const staticFallbacks = {
  'sairam-hospital': {
    name: 'SAIRAM HOSPITAL',
    type: 'hospital',
    shortBio: 'Led by Dr. C. Satish Reddy & Dr. K. Lalitha Shirdisa',
    description: 'A beacon of health and community care, Sairam Hospital stands as a proud partner of VidyaVaidya Trust, providing vital medical assistance and unwavering support to our mission of healing and empowerment.',
    supportQuote: 'VidyaVaidya Trust has been doing phenomenal work in bringing healthcare and education to those who need it most. At Sairam Hospital, we strongly believe in their vision. It is our privilege to partner with them, providing medical care and resources to ensure that every individual has access to a healthier, brighter future.',
    supportQuoteAuthor: 'Dr. C. Satish Reddy & Dr. K. Lalitha Shirdisa',
    supportQuoteAuthorTitle: 'Founders, SAIRAM HOSPITAL',
    logoUrl: SairamLogo,
    galleryUrls: [SairamImg2, SairamImg3]
  },
  'charani-infotech': {
    name: 'CHARANI INFOTECH',
    type: 'corporate',
    shortBio: 'Led by CEO G.Rajsekhar',
    description: 'A leader in technological innovation, Charani Infotech stands as a proud corporate sponsor of VidyaVaidya Trust, providing vital digital resources and unwavering support to our mission of education and empowerment.',
    supportQuote: 'At Charani Infotech, we believe that technology should be a force for good. We are incredibly proud to sponsor the VidyaVaidya Trust. Their dedication to bridging gaps in education and healthcare aligns perfectly with our core values. We are committed to supporting their digital transformation and helping them scale their impact.',
    supportQuoteAuthor: 'G. Rajsekhar',
    supportQuoteAuthorTitle: 'CEO, Charani Infotech',
    supportQuoteAuthorImage: RajsekharImg,
    logoUrl: EntranceImg,
    galleryUrls: [InsideImg, NamePlateImg]
  }
};

export default function PartnerDetail() {
  const { slug } = useParams();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartner = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.partners.getBySlug(slug);
        if (res && res.success && res.partner) {
          setPartner(res.partner);
        } else {
          // Fall back to static dictionary
          if (staticFallbacks[slug]) {
            setPartner(staticFallbacks[slug]);
          } else {
            setError('Partner profile not found');
          }
        }
      } catch (err) {
        console.warn('API error fetching partner detail, trying fallback:', err);
        if (staticFallbacks[slug]) {
          setPartner(staticFallbacks[slug]);
        } else {
          setError(err.message || 'Failed to load partner details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-500 font-bold text-sm">Loading partner details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 px-6">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full border border-slate-100 text-center">
            <span className="text-6xl block mb-6">🤝</span>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Profile Not Available</h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              {error || "The requested partner collaboration page is not registered or is currently offline."}
            </p>
            <Link to="/partners" className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-full transition-all text-xs uppercase tracking-wider">
              Back to Partners
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getBgGradient = (type) => {
    switch (type) {
      case 'hospital':
        return 'from-green-700 via-teal-800 to-blue-900';
      case 'ngo':
        return 'from-orange-600 via-amber-700 to-red-800';
      case 'educational':
        return 'from-blue-700 via-indigo-800 to-slate-900';
      case 'corporate':
        return 'from-purple-700 via-indigo-800 to-blue-900';
      default:
        return 'from-slate-700 via-teal-800 to-emerald-900';
    }
  };

  const getBadgeTag = (type) => {
    switch (type) {
      case 'hospital': return 'Official Medical Partner';
      case 'ngo': return 'Official NGO Partner';
      case 'educational': return 'Official Academic Partner';
      case 'corporate': return 'Official Corporate Partner';
      default: return 'Official Volunteer Partner';
    }
  };

  const galleryImages = partner.galleryUrls || partner.galleryImages || [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className={`relative pt-32 pb-24 px-6 lg:px-20 overflow-hidden bg-gradient-to-br ${getBgGradient(partner.type)} text-white`}>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-cyan-400/20 blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/3 flex justify-center w-full">
            <div className="bg-white p-6 rounded-3xl shadow-2xl w-full flex justify-center items-center overflow-hidden">
              <img 
                src={partner.logoUrl || partner.coverImageUrl || SairamLogo} 
                alt={`${partner.name} Logo`} 
                className="w-full h-auto object-contain max-h-64 rounded-2xl" 
              />
            </div>
          </div>
          <div className="md:w-2/3 text-center md:text-left">
            <span className="inline-flex rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200 mb-6">
              {getBadgeTag(partner.type)}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight uppercase">{partner.name}</h1>
            {partner.shortBio && (
              <p className="text-xl text-teal-100 font-medium mb-6">{partner.shortBio}</p>
            )}
            <p className="text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto md:mx-0">
              {partner.description || "Proud collaborative partner of VidyaVaidya Trust, aligning digital expertise, physical outreach, and community engagement to drive societal upliftment and healthcare support."}
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial/Quote Section */}
      {partner.supportQuote && (
        <section className="py-20 px-6 lg:px-20 bg-white">
          <div className="max-w-5xl mx-auto text-center">
            <svg className="w-16 h-16 mx-auto text-teal-500 mb-6 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <h2 className="text-3xl font-bold text-slate-800 mb-8">A Message of Support</h2>
            <blockquote className="text-2xl md:text-3xl font-medium text-slate-600 leading-relaxed italic mb-8">
              "{partner.supportQuote}"
            </blockquote>
            <div className="flex flex-col items-center justify-center mt-10">
              {partner.supportQuoteAuthorImage && (
                <img 
                  src={partner.supportQuoteAuthorImage} 
                  alt={partner.supportQuoteAuthor} 
                  className="w-24 h-24 rounded-full object-cover mb-4 shadow-lg border-4 border-emerald-50" 
                />
              )}
              <div className="w-16 h-1 bg-teal-500 rounded-full mb-4"></div>
              <p className="text-xl font-bold text-slate-900">{partner.supportQuoteAuthor || partner.name}</p>
              <p className="text-teal-600 font-semibold uppercase tracking-wider text-sm mt-1">
                {partner.supportQuoteAuthorTitle || `Founders, ${partner.name}`}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="py-20 px-6 lg:px-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Partner Highlights</h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                Glimpses of our collaborative efforts and the state-of-the-art facilities at {partner.name}.
              </p>
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-${Math.min(galleryImages.length, 2)} gap-8`}>
              {galleryImages.map((imgUrl, index) => (
                <div key={index} className="group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 bg-white">
                  <div className="relative overflow-hidden aspect-[4/3] bg-slate-100 flex items-center justify-center">
                    <img 
                      src={imgUrl} 
                      alt={`${partner.name} Highlight ${index + 1}`} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                      <p className="text-white font-bold text-2xl mb-2">{partner.name} Workspace</p>
                      <p className="text-teal-200 font-medium">Empowering communities together.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
