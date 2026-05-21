import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import api from '../services/api';
import { 
  HeartPulse, Briefcase, GraduationCap, Handshake, Users, 
  MapPin, Globe, Phone, Mail, X, ExternalLink, Star, Calendar, ArrowLeft, 
  CheckCircle2, Image as ImageIcon, MessageSquare, ArrowRight 
} from 'lucide-react';

// Brand Icons
const Facebook = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const Instagram = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
const Linkedin = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
const Twitter = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;


// ── Static fallback assets ────────────────────────────────────────────────────
import SairamLogo from '../assets/Partners/GLOBAL HEALTH CARE/SAIRAM HOSPITAL/1.png';
import SairamImg2 from '../assets/Partners/GLOBAL HEALTH CARE/SAIRAM HOSPITAL/2.png';
import SairamImg3 from '../assets/Partners/GLOBAL HEALTH CARE/SAIRAM HOSPITAL/3.png';

import EntranceImg from '../assets/Partners/CORPORATE SPONSOR/Charani Infotech/Entrance.JPG';
import InsideImg from '../assets/Partners/CORPORATE SPONSOR/Charani Infotech/Inside1.JPG';
import NamePlateImg from '../assets/Partners/CORPORATE SPONSOR/Charani Infotech/Name plate.JPG';
import RajsekharImg from '../assets/Partners/CORPORATE SPONSOR/Charani Infotech/Rajsekhar.JPG';

// ── Static data fallbacks ─────────────────────────────────────────────────────
const staticFallbacks = {
  'sairam-hospital': {
    name: 'SAIRAM HOSPITAL',
    type: 'hospital',
    shortBio: 'Led by Dr. C. Satish Reddy & Dr. K. Lalitha Shirdisa',
    description:
      'A beacon of health and community care, Sairam Hospital stands as a proud partner of VidyaVaidya Trust, providing vital medical assistance and unwavering support to our mission of healing and empowerment.',
    supportQuote:
      'VidyaVaidya Trust has been doing phenomenal work in bringing healthcare and education to those who need it most. At Sairam Hospital, we strongly believe in their vision. It is our privilege to partner with them, providing medical care and resources to ensure that every individual has access to a healthier, brighter future.',
    supportQuoteAuthor: 'Dr. C. Satish Reddy & Dr. K. Lalitha Shirdisa',
    supportQuoteAuthorTitle: 'Founders, SAIRAM HOSPITAL',
    logoUrl: SairamLogo,
    galleryUrls: [SairamImg2, SairamImg3],
  },
  'charani-infotech': {
    name: 'CHARANI INFOTECH',
    type: 'corporate',
    shortBio: 'Led by CEO G. Rajsekhar',
    description:
      'A leader in technological innovation, Charani Infotech stands as a proud corporate sponsor of VidyaVaidya Trust, providing vital digital resources and unwavering support to our mission of education and empowerment.',
    supportQuote:
      'At Charani Infotech, we believe that technology should be a force for good. We are incredibly proud to sponsor the VidyaVaidya Trust. Their dedication to bridging gaps in education and healthcare aligns perfectly with our core values. We are committed to supporting their digital transformation and helping them scale their impact.',
    supportQuoteAuthor: 'G. Rajsekhar',
    supportQuoteAuthorTitle: 'CEO, Charani Infotech',
    supportQuoteAuthorImage: RajsekharImg,
    logoUrl: EntranceImg,
    galleryUrls: [InsideImg, NamePlateImg],
  },
};

// ── Type-aware visual config with enhanced visual styles ──────────────────────────────────
const TYPE_CONFIG = {
  hospital: {
    label: 'Hospital Network',
    badge: 'Official Medical Partner',
    gradient: 'from-emerald-600 via-teal-700 to-cyan-900',
    accentBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeBg: 'bg-emerald-500/10 border-emerald-400/20 text-emerald-300',
    logoGlow: 'shadow-emerald-500/20 group-hover:border-emerald-400/50',
    btnBg: 'bg-emerald-500 hover:bg-emerald-400 text-teal-950',
    accentText: 'text-teal-600',
    parentLink: '/partners/global-health-care',
    parentName: 'Global Health Care',
    Icon: HeartPulse,
  },
  corporate: {
    label: 'Corporate Sponsor',
    badge: 'Official Tech Partner',
    gradient: 'from-violet-700 via-purple-800 to-indigo-950',
    accentBg: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeBg: 'bg-purple-500/10 border-purple-400/20 text-purple-300',
    logoGlow: 'shadow-purple-500/20 group-hover:border-purple-400/50',
    btnBg: 'bg-purple-500 hover:bg-purple-400 text-indigo-950',
    accentText: 'text-purple-600',
    parentLink: '/EducationSupport', // Mapped to Education Support or corporate network as in main page
    parentName: 'Corporate Sponsors',
    Icon: Briefcase,
  },
  ngo: {
    label: 'NGO Partner',
    badge: 'Official NGO Partner',
    gradient: 'from-amber-600 via-orange-700 to-rose-900',
    accentBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeBg: 'bg-amber-500/10 border-amber-400/20 text-amber-300',
    logoGlow: 'shadow-amber-500/20 group-hover:border-amber-400/50',
    btnBg: 'bg-amber-500 hover:bg-amber-400 text-rose-950',
    accentText: 'text-amber-600',
    parentLink: '/NGO',
    parentName: 'NGO Network',
    Icon: Handshake,
  },
  educational: {
    label: 'Educational Institution',
    badge: 'Official Academic Partner',
    gradient: 'from-blue-600 via-indigo-700 to-violet-900',
    accentBg: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeBg: 'bg-blue-500/10 border-blue-400/20 text-blue-300',
    logoGlow: 'shadow-blue-500/20 group-hover:border-blue-400/50',
    btnBg: 'bg-blue-500 hover:bg-blue-400 text-indigo-950',
    accentText: 'text-blue-600',
    parentLink: '/EducationSupport',
    parentName: 'Education Support',
    Icon: GraduationCap,
  },
  government: {
    label: 'Volunteer Network',
    badge: 'Official Volunteer Partner',
    gradient: 'from-rose-600 via-pink-700 to-red-950',
    accentBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeBg: 'bg-rose-500/10 border-rose-400/20 text-rose-300',
    logoGlow: 'shadow-rose-500/20 group-hover:border-rose-400/50',
    btnBg: 'bg-rose-500 hover:bg-rose-400 text-red-950',
    accentText: 'text-rose-600',
    parentLink: '/Ourvolunteers',
    parentName: 'Our Volunteers',
    Icon: Users,
  },
};

// ── Date formatter ────────────────────────────────────────────────────────────
const fmtDate = (val) => {
  if (!val) return null;
  if (typeof val === 'object' && val._seconds) {
    return new Date(val._seconds * 1000).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return String(val);
  }
};

// ── Extract initials for fallback avatar ──────────────────────────────────────
const getInitials = (name) => {
  if (!name) return 'VV';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export default function PartnerDetail() {
  const { slug } = useParams();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    const fetchPartner = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.partners.getBySlug(slug);
        if (res && res.success && res.partner) {
          setPartner(res.partner);
        } else {
          // Normalize slug match for fallbacks (e.g. charani-infotech-pvt-ltd matches static charani-infotech)
          const matchedSlug = Object.keys(staticFallbacks).find(k => slug.includes(k)) || slug;
          if (staticFallbacks[matchedSlug]) {
            setPartner(staticFallbacks[matchedSlug]);
          } else {
            setError('Partner profile not found');
          }
        }
      } catch (err) {
        console.warn('API error, using fallback:', err);
        const matchedSlug = Object.keys(staticFallbacks).find(k => slug.includes(k)) || slug;
        if (staticFallbacks[matchedSlug]) {
          setPartner(staticFallbacks[matchedSlug]);
        } else {
          setError(err.message || 'Failed to load partner details');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPartner();
  }, [slug]);

  // ── Loading state ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-32">
          <div className="text-center space-y-4">
            <div className="relative inline-flex">
              <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-b-teal-500 animate-spin" />
              <div className="absolute inset-0 m-auto w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center">
                <span className="text-xs">🤝</span>
              </div>
            </div>
            <p className="text-slate-500 font-bold text-sm tracking-wide animate-pulse">Retrieving partnership credentials...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error || !partner) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-24 px-6">
          <div className="bg-white p-12 rounded-[2rem] shadow-xl max-w-md w-full border border-slate-100/80 text-center space-y-6">
            <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner animate-bounce">
              🔍
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Collaboration Offline</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                {error || 'The requested partner collaboration page is not registered or currently offline.'}
              </p>
            </div>
            <Link
              to="/partners"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-full transition-all text-xs uppercase tracking-wider shadow-lg hover:shadow-slate-900/10"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Partners
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Normalise all fields (support both nested and flat structures) ───────────
  const config = TYPE_CONFIG[partner.type] || TYPE_CONFIG.hospital;
  const galleryImages = partner.galleryUrls || partner.galleryImages || [];

  // Location
  const city    = partner.location?.city    || partner.city    || '';
  const state   = partner.location?.state   || partner.state   || '';
  const address = partner.location?.address || partner.address || '';
  const country = partner.location?.country || partner.country || '';

  // Social links
  const linkedin  = partner.socialLinks?.linkedin  || partner.linkedinUrl  || '';
  const twitter   = partner.socialLinks?.twitter   || partner.twitterUrl   || '';
  const facebook  = partner.socialLinks?.facebook  || partner.facebookUrl  || '';
  const instagram = partner.socialLinks?.instagram || partner.instagramUrl || '';
  const website   = partner.website || partner.websiteUrl || '';

  // Contact
  const contactEmail = partner.contactEmail || '';
  const contactPhone = partner.contactPhone || '';

  // Dates & status
  const partnershipDate = fmtDate(partner.partnershipStartDate || partner.partnerSince);
  const isActive = partner.isActive !== false;

  // Computed booleans for conditional sections
  const hasSocials  = linkedin || twitter || facebook || instagram || website;
  const hasContact  = contactEmail || contactPhone || website;
  const hasLocation = city || state || address || country;
  const hasSection3 = hasSocials || partnershipDate || partner.isFeatured !== undefined;
  const hasSection2 = hasContact || hasLocation;

  // Google Maps URL
  const mapsUrl = (city || address)
    ? `https://maps.google.com/?q=${encodeURIComponent([address, city, state, country].filter(Boolean).join(', '))}`
    : null;

  // Visual resolver for partner logo (take cover banner or category icon fallback instead of hardcoded hospital logo)
  const renderLogo = () => {
    if (partner.logoUrl) {
      return (
        <img
          src={partner.logoUrl}
          alt={`${partner.name} Logo`}
          className="w-full h-full object-contain p-2 rounded-2xl"
        />
      );
    } else if (partner.coverImageUrl) {
      // Fallback 1: Take cover banner image in the logo slot if logo is missing (as requested)
      return (
        <img
          src={partner.coverImageUrl}
          alt={`${partner.name} Backdrop Fallback`}
          className="w-full h-full object-cover rounded-2xl"
        />
      );
    } else {
      // Fallback 2: Generate a stunning glassmorphic initials-avatar badge with category gradients
      return (
        <div className={`w-full h-full rounded-2xl bg-gradient-to-tr ${config.gradient} flex flex-col items-center justify-center text-white p-4 select-none`}>
          <span className="text-4xl font-black tracking-wider leading-none">
            {getInitials(partner.name)}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 mt-1">
            {config.label.split(' ')[0]}
          </span>
        </div>
      );
    }
  };

  const LogoIcon = config.Icon;

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 selection:bg-teal-500 selection:text-white">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1 — HERO SECTION (COVER + FLOATING INFO)
          Immersive double-layered layout featuring cover banner, glassmorphic overlap.
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10">
        {/* Full-width interactive Cover Banner backdrop */}
        <div className="h-64 sm:h-80 md:h-96 w-full relative overflow-hidden bg-slate-900">
          {partner.coverImageUrl ? (
            <>
              <img 
                src={partner.coverImageUrl} 
                alt={`${partner.name} Cover Banner`} 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
            </>
          ) : (
            // Premium mesh fallback banner
            <div className={`w-full h-full bg-gradient-to-tr ${config.gradient} opacity-95 relative`}>
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 to-transparent" />
            </div>
          )}
          
          {/* Cover bottom decorative fade */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-slate-50/50 to-transparent pointer-events-none" />
        </div>

        {/* Content details overlapping cover banner */}
        <div className="max-w-7xl mx-auto px-6 lg:px-20 -mt-24 sm:-mt-32 md:-mt-40 relative z-25">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-2xl border border-white/50 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10">
            
            {/* Immersive Floating Logo Frame */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] bg-white p-3.5 shadow-2xl border border-slate-100 flex-shrink-0 flex items-center justify-center relative -mt-16 sm:-mt-24 md:-mt-28 group transform hover:scale-[1.03] transition-all duration-350">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-slate-100 to-white -z-10" />
              {/* Outer decorative ring glowing with category theme */}
              <div className={`absolute -inset-1 rounded-[2.1rem] border-2 border-dashed border-slate-200/50 group-hover:border-solid transition-all duration-350 ${config.logoGlow}`} />
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                {renderLogo()}
              </div>
            </div>

            {/* Title / Description contents */}
            <div className="flex-grow text-center md:text-left space-y-4">
              
              {/* Breadcrumb & Category badge */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 flex-wrap">
                <Link
                  to={config.parentLink}
                  className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-wider transition-colors group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  {config.parentName}
                </Link>
                <span className="hidden sm:inline text-slate-350">|</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-4.5 py-1 text-xs font-extrabold uppercase tracking-widest ${config.badgeBg} border`}>
                  <LogoIcon className="w-3.5 h-3.5" />
                  {config.badge}
                </span>
                {partner.isFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 px-4.5 py-1 text-xs font-extrabold uppercase tracking-widest">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Featured
                  </span>
                )}
              </div>

              {/* Partner Name */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 uppercase leading-none pt-1">
                {partner.name}
              </h1>

              {/* Short Bio Tagline */}
              {partner.shortBio && (
                <p className={`text-base sm:text-lg font-bold italic leading-relaxed ${config.accentText}`}>
                  {partner.shortBio}
                </p>
              )}

              {/* Metadata Tags Row */}
              <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2.5 pt-2 text-slate-550 text-xs font-semibold">
                {(city || state) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {[city, state].filter(Boolean).join(', ')}
                  </span>
                )}
                {partnershipDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Partner since {partnershipDate}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-350'}`} />
                  <span className={`font-bold ${isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {isActive ? 'Active Partnership' : 'Inactive'}
                  </span>
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Main Contents ─────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 lg:px-20 py-16 space-y-20 relative z-20">

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2 — DESCRIPTION & QUOTE BLOCK
            Main body collaboration narrative + gorgeous customer endorsement quote.
        ═══════════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Core Collaboration Narrative */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-100/50 border border-slate-100 space-y-6">
            <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-teal-500 rounded-full" />
              Collaboration Overview
            </h3>
            <p className="text-slate-650 text-base md:text-lg leading-relaxed font-normal whitespace-pre-line">
              {partner.description || `VidyaVaidya Trust has joined forces with ${partner.name} to advance our collective community empowerment goals. Through structured operations, transparent management, and active support programs, this alliance helps us deliver meaningful community impact where it is needed most.`}
            </p>
          </div>

          {/* Styled Message of Support Quote Card */}
          {partner.supportQuote && (
            <div className="lg:col-span-5 bg-gradient-to-br from-white to-slate-50 rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-100/50 border border-slate-100 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              {/* Massive background double quotation mark */}
              <div className="absolute top-4 left-6 text-[150px] leading-none text-slate-100 font-serif select-none pointer-events-none z-0">
                &ldquo;
              </div>

              <div className="relative z-10 space-y-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[10px] font-black uppercase tracking-wider">
                  <MessageSquare className="w-3 h-3" /> Partner Voice
                </span>
                <blockquote className="text-base sm:text-lg font-medium text-slate-600 italic leading-relaxed">
                  &ldquo;{partner.supportQuote}&rdquo;
                </blockquote>
              </div>

              <div className="relative z-10 pt-6 flex items-center gap-4 border-t border-slate-100/80 mt-6">
                {partner.supportQuoteAuthorImage && (
                  <img
                    src={partner.supportQuoteAuthorImage}
                    alt={partner.supportQuoteAuthor}
                    className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-white ring-2 ring-slate-100"
                  />
                )}
                <div>
                  <p className="text-sm font-extrabold text-slate-900 leading-tight">
                    {partner.supportQuoteAuthor || partner.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    {partner.supportQuoteAuthorTitle || config.badge}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3 — DYNAMIC HIGHLIGHTS GALLERY (THE 3 IMAGES)
            Beautiful showcase masonry/tiled grid featuring zoom micro-interactions.
        ═══════════════════════════════════════════════════════════════ */}
        {galleryImages.length > 0 && (
          <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-white">
            {/* Visual background lights */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className={`absolute -top-1/2 -left-1/4 w-3/4 h-full rounded-full bg-gradient-to-tr ${config.gradient} opacity-20 blur-[130px]`} />
              <div className="absolute -bottom-1/2 -right-1/4 w-3/4 h-full rounded-full bg-slate-950 opacity-50 blur-[100px]" />
            </div>

            <div className="relative z-10 space-y-10">
              {/* Section Header */}
              <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4 border-b border-white/10 pb-6">
                <div className="text-center md:text-left space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-[10px] font-black uppercase tracking-widest">
                    <ImageIcon className="w-3.5 h-3.5" /> Collaboration Gallery
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                    A Glimpse Inside Our Partnership
                  </h2>
                  <p className="text-white/60 text-xs sm:text-sm max-w-xl">
                    Visual updates, dynamic milestones, and facilities supported by {partner.name}.
                  </p>
                </div>
                <div className="flex-shrink-0 bg-white/5 border border-white/15 px-4 py-2 rounded-2xl text-xs font-bold text-white/80">
                  {galleryImages.length} Highlight Image{galleryImages.length > 1 ? 's' : ''}
                </div>
              </div>

              {/* Creative Photo Grid */}
              <div
                className={`grid gap-6 ${
                  galleryImages.length === 1
                    ? 'grid-cols-1 max-w-2xl mx-auto'
                    : galleryImages.length === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {galleryImages.map((img, i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-3xl cursor-pointer bg-slate-800 border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 active:scale-[0.99] flex flex-col justify-end"
                    style={{ aspectRatio: '4/3' }}
                    onClick={() => setLightboxImg(img)}
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-40 group-hover:opacity-65 transition-all duration-500 z-10" />
                    
                    <img
                      src={img}
                      alt={`${partner.name} Highlight ${i + 1}`}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 z-0"
                    />

                    {/* Styled details tag */}
                    <div className="relative z-20 p-5 transform translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-350 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400">Milestone {i + 1}</p>
                        <p className="text-white font-extrabold text-sm mt-0.5">Click to Enlarge</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xs font-black">
                        →
                      </div>
                    </div>

                    {/* Frame indicator */}
                    <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity z-20">
                      <span className="text-white text-[10px] font-black">{i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4 — PARTNERSHIP SPECS & CONNECTIVITY
            Detailed grid showcasing administrative data alongside social channels.
        ═══════════════════════════════════════════════════════════════ */}
        {hasSection3 && (
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Integrity Metrics
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Partnership Details</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Partnership Info Card */}
              <div className="lg:col-span-6 bg-white rounded-[2rem] shadow-xl shadow-slate-100/50 border border-slate-100 p-8 space-y-6">
                <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest pb-3 border-b border-slate-100">
                  Partnership Dossier
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Category */}
                  <div className="flex items-center gap-4 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${config.gradient} text-white flex items-center justify-center flex-shrink-0 text-xl shadow-md`}>
                      <LogoIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Classification</p>
                      <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Date Joined */}
                  {partnershipDate && (
                    <div className="flex items-center gap-4 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Affiliated Since</p>
                        <p className="text-sm font-extrabold text-slate-800 mt-1">{partnershipDate}</p>
                      </div>
                    </div>
                  )}

                  {/* Status Indicator */}
                  <div className="flex items-center gap-4 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${isActive ? 'bg-emerald-50 border border-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operational Status</p>
                      <p className={`text-sm font-extrabold mt-1 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {isActive ? 'Active & Ongoing' : 'Inactive / Paused'}
                      </p>
                    </div>
                  </div>

                  {/* Display Priority order */}
                  <div className="flex items-center gap-4 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trust Level</p>
                      <p className="text-sm font-extrabold text-slate-800 mt-1">
                        {partner.isFeatured ? 'Gold Featured' : 'Verified Partner'}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Social Channels Card */}
              <div className="lg:col-span-6 bg-white rounded-[2rem] shadow-xl shadow-slate-100/50 border border-slate-100 p-8 flex flex-col justify-between">
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest pb-3 border-b border-slate-100">
                    Connect Internationally
                  </h3>

                  {hasSocials ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Website */}
                      {website && (
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all duration-200 group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            <Globe className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Website</p>
                            <p className="text-xs font-bold text-slate-700 truncate group-hover:text-teal-700 mt-0.5">
                              Launch Site
                            </p>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-350 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                        </a>
                      )}

                      {/* LinkedIn */}
                      {linkedin && (
                        <a
                          href={linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            <Linkedin className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">LinkedIn</p>
                            <p className="text-xs font-bold text-slate-700 truncate group-hover:text-blue-700 mt-0.5">
                              Company Profile
                            </p>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-350 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                        </a>
                      )}

                      {/* Twitter / X */}
                      {twitter && (
                        <a
                          href={twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            <Twitter className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Twitter / X</p>
                            <p className="text-xs font-bold text-slate-700 truncate group-hover:text-slate-900 mt-0.5">
                              Follow Handles
                            </p>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-350 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                        </a>
                      )}

                      {/* Facebook */}
                      {facebook && (
                        <a
                          href={facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            <Facebook className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Facebook</p>
                            <p className="text-xs font-bold text-slate-700 truncate group-hover:text-blue-600 mt-0.5">
                              View Page
                            </p>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-350 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                        </a>
                      )}

                      {/* Instagram */}
                      {instagram && (
                        <a
                          href={instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all duration-200 group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-650 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            <Instagram className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Instagram</p>
                            <p className="text-xs font-bold text-slate-700 truncate group-hover:text-pink-600 mt-0.5">
                              View Highlights
                            </p>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-350 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                        </a>
                      )}
                    </div>
                  ) : (
                    /* High-fidelity elegant placeholder card instead of plain text banner */
                    <div className="border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-2 select-none">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-450 border border-slate-200">
                        <Globe className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">Corporate Portal Active</p>
                      <p className="text-[10px] text-slate-450 max-w-xs font-medium leading-relaxed">
                        Public social handles are currently being configured by {partner.name}. Verify credentials below or request support.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-50 mt-6 flex justify-between items-center text-[10px] text-slate-400 font-bold select-none uppercase">
                  <span>SSL SECURE CONNECTION</span>
                  <span>VERIFIED PROFILE ✓</span>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5 — GET IN TOUCH (CONTACT & LOCATION)
            Interactive maps, click-to-dial contacts cards with hover motion.
        ═══════════════════════════════════════════════════════════════ */}
        {hasSection2 && (
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                📍 Coordinates
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Get In Touch</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Contact Information */}
              {hasContact && (
                <div className="lg:col-span-5 bg-white rounded-[2rem] shadow-xl shadow-slate-100/50 border border-slate-100 p-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest pb-3 border-b border-slate-100">
                      Direct Communication
                    </h3>

                    <div className="space-y-4">
                      {/* Email */}
                      {contactEmail && (
                        <a
                          href={`mailto:${contactEmail}`}
                          className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:border-teal-200 hover:bg-teal-50/20 transition-all duration-200 group"
                        >
                          <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                            <p className="text-sm font-extrabold text-slate-700 group-hover:text-teal-700 truncate mt-0.5">
                              {contactEmail}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5" />
                        </a>
                      )}

                      {/* Phone */}
                      {contactPhone && (
                        <a
                          href={`tel:${contactPhone}`}
                          className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all duration-200 group"
                        >
                          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Phone Line</p>
                            <p className="text-sm font-extrabold text-slate-700 group-hover:text-emerald-700 truncate mt-0.5">
                              {contactPhone}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5" />
                        </a>
                      )}

                      {/* Website */}
                      {website && (
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:border-blue-200 hover:bg-blue-50/20 transition-all duration-200 group"
                        >
                          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <Globe className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Official Web portal</p>
                            <p className="text-sm font-extrabold text-slate-700 group-hover:text-blue-700 truncate mt-0.5">
                              {website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Physical Location */}
              {hasLocation && (
                <div className="lg:col-span-7 bg-white rounded-[2rem] shadow-xl shadow-slate-100/50 border border-slate-100 p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest pb-3 border-b border-slate-100">
                      Physical Location
                    </h3>

                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center flex-shrink-0 text-2xl shadow-inner mt-1">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        {address && (
                          <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">{address}</p>
                        )}
                        {(city || state) && (
                          <p className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-none pt-1">
                            {[city, state].filter(Boolean).join(', ')}
                          </p>
                        )}
                        {country && (
                          <p className="text-xs sm:text-sm text-slate-450 font-bold uppercase tracking-wider mt-0.5">{country}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {mapsUrl && (
                    <div className="pt-6 border-t border-slate-50 flex items-center justify-start">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-full transition-all text-xs uppercase tracking-wider shadow-lg hover:shadow-slate-900/10 active:scale-95"
                      >
                        <Globe className="w-4 h-4" /> View on Google Maps
                      </a>
                    </div>
                  )}
                </div>
              )}

            </div>
          </section>
        )}

      </main>

      {/* ─── Immersive CTA Section ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 sm:py-32 px-6 bg-slate-950 text-center text-white z-20">
        {/* Neon lights backdrop */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className={`absolute top-0 left-1/4 w-1/2 h-full rounded-full bg-gradient-to-tr ${config.gradient} opacity-20 blur-[130px]`} />
          <div className="absolute bottom-0 right-1/4 w-1/2 h-full rounded-full bg-slate-900 opacity-60 blur-[110px]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest text-teal-300">
            Expand Our Network
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Join Our Network of Change-Makers
          </h2>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            We are always looking for passionate medical institutions, tech companies, and NGOs to expand our reach and amplify our collective impact.
          </p>
          <div className="pt-4">
            <Link
              to="/join-community"
              className="inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-350 text-teal-950 font-black px-10 py-4.5 rounded-full hover:scale-105 active:scale-98 transition-all shadow-xl shadow-emerald-400/10 hover:shadow-emerald-400/20"
            >
              Become a Partner →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Premium Image Lightbox ────────────────────────────────────────────── */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 transition-all duration-300"
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center text-xl font-bold transition-all border border-white/15 hover:rotate-90"
            onClick={() => setLightboxImg(null)}
            aria-label="Close"
          >
            ✕
          </button>
          
          <div 
            className="relative max-w-5xl w-full max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImg}
              alt="Gallery highlight full view"
              className="max-w-full max-h-[80vh] object-contain rounded-[2rem] shadow-2xl border border-white/10"
            />
            
            {/* Overlay description */}
            <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 bg-white/5 border border-white/10 rounded-full px-6 py-2 backdrop-blur-md flex items-center gap-2 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-white text-xs font-bold uppercase tracking-wider">Highlight View Mode</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
