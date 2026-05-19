import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import shape2 from "../assets/hero/shape-2.png";
import shape3 from "../assets/hero/shape-3.png";
import shape from "../assets/hero/shape.png";
import Bg from "../assets/bg/01.jpg";
import Bg2 from "../assets/bg/1.jpg";
import Bg3 from "../assets/bg/2.jpg";
import Bg4 from "../assets/bg/3.jpg";

import ChairmanImg from "../assets/3members/Chairman & Managing Trustee.jpeg";
import SecretaryImg from "../assets/3members/Secretary.jpeg";
import TreasurerImg from "../assets/3members/Treasurer.jpeg";

import "./Hero.css";

/* ─────────────────────────────────────────
   HERO CONFIG — edit text / links here only
───────────────────────────────────────────*/
const HERO = {
  tagline: "Non - Profit Charity",
  heading: (<>Make Someone's <br />Life By Giving Of <br />Yours's.</>),
  primaryBtn: { label: "Join With Us \u2197", href: "/donate" },
  videoBtn: { href: "https://www.youtube.com/watch?v=Cn4G2lZ_g2I", label: "Video Playing Theme" },
};

/* ─────────────────────────────────────────
   HERO BACKGROUND IMAGES — add/remove here
───────────────────────────────────────────*/
const BG_IMAGES = [Bg, Bg2, Bg3, Bg4];

/* ─── Main Hero Component ─── */
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();
  const total = BG_IMAGES.length;

  const goTo = useCallback((n) => {
    setPrev(current);
    setCurrent(n);
    setTimeout(() => setPrev(null), 3000);
  }, [current]);

  /* auto-advance every 5 s */
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => goTo((current + 1) % total), 3000);
    return () => clearInterval(t);
  }, [current, paused, goTo, total]);

  const goPrev = () => goTo((current - 1 + total) % total);
  const goNext = () => goTo((current + 1) % total);

  return (
    <section
      className="hero-bg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background slides ── */}
      {BG_IMAGES.map((img, i) => (
        <div
          key={i}
          className={`hero-slide${i === current ? " hero-slide--active animate-zoom-in" : ""}${i === prev ? " hero-slide--prev" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
          aria-hidden={i !== current}
        />
      ))}

      {/* dark gradient overlay */}
      <div className="hero-overlay" />

      {/* decorative shapes */}
      <div className="hero-shape hero-shape--left">
        <img src={shape2} alt="" aria-hidden="true" />
      </div>
      <div className="hero-shape hero-shape--right">
        <img src={shape3} alt="" aria-hidden="true" />
      </div>
      <div className="hero-shape hero-shape--left2">
        <img src={shape} alt="" aria-hidden="true" />
      </div>

      {/* ── content wrapper — adjust .hero-container in CSS to reposition ── */}
      <div className="hero-container">
        <div className="hero-content">

          <p className="hero-tagline animate-slide-up delay-100">{HERO.tagline}</p>
          <h1 className="hero-heading animate-slide-up delay-200">{HERO.heading}</h1>

          <div className="hero-actions animate-slide-up delay-300">
            <button
              onClick={() => navigate(HERO.primaryBtn.href)}
              className="hero-btn-primary"
            >
              {HERO.primaryBtn.label}
            </button>
            <span className="hero-video-wrap">
              <a
                href={HERO.videoBtn.href}
                className="hero-video-btn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Play video"
              >
                <i className="fa-solid fa-play" aria-hidden="true" />
              </a>
              <span className="hero-video-label">{HERO.videoBtn.label}</span>
            </span>
          </div>

        </div>
      </div>

      {/* ── Prev button — left edge, vertically centered ── */}
      <button className="hero-nav-btn hero-nav-btn--left" onClick={goPrev} aria-label="Previous slide">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* ── Dots — bottom center only ── */}
      <div className="hero-dots">
        {BG_IMAGES.map((_, i) => (
          <button
            key={i}
            className={`hero-dot${i === current ? " hero-dot--active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Next button — right edge, vertically centered ── */}
      <button className="hero-nav-btn hero-nav-btn--right" onClick={goNext} aria-label="Next slide">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      {/* ── Progress bar ── */}
      <div className="hero-progress">
        <div
          key={current}
          className={`hero-progress-bar${!paused ? " hero-progress-bar--running" : ""}`}
        />
      </div>

    </section>
  );
}

/* ─────────────────────────────────────────
   WHAT WE DO DATA — edit cards here
───────────────────────────────────────────*/
const SERVICES = [
  {
    id: "education", theme: "svc-pink", title: "Education",
    desc: "Providing quality education and learning opportunities to empower the next generation.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="46" height="46">
        <circle cx="30" cy="16" r="7" stroke="#e05252" strokeWidth="2.4" />
        <path d="M16 46 C16 33 44 33 44 46" stroke="#e05252" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M10 42 C10 35 16 33 22 35" stroke="#e05252" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M50 42 C50 35 44 33 38 35" stroke="#e05252" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="10" cy="38" r="4.5" stroke="#e05252" strokeWidth="2.2" />
        <circle cx="50" cy="38" r="4.5" stroke="#e05252" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    id: "water", theme: "svc-green", title: "Safe Water",
    desc: "Ensuring access to clean and safe drinking water for communities in need.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="46" height="46">
        <path d="M30 8 C22 20 14 27 14 36 a16 16 0 0 0 32 0 C46 27 38 20 30 8Z" stroke="#ffffff" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M22 38 Q24 42 30 43" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "food", theme: "svc-yellow", title: "Healthy Food",
    desc: "Distributing nutritious meals and supporting sustainable food programs.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="46" height="46">
        <circle cx="30" cy="30" r="16" stroke="#b87800" strokeWidth="2.4" />
        <circle cx="30" cy="30" r="7" stroke="#b87800" strokeWidth="2.4" />
        <circle cx="20" cy="24" r="2" fill="#b87800" />
        <circle cx="40" cy="24" r="2" fill="#b87800" />
        <circle cx="16" cy="34" r="2" fill="#b87800" />
        <circle cx="44" cy="34" r="2" fill="#b87800" />
        <circle cx="30" cy="46" r="2" fill="#b87800" />
        <path d="M22 17 Q30 13 38 17" stroke="#b87800" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "medical", theme: "svc-purple", title: "Medical Care",
    desc: "Offering essential healthcare services and medical support to those who need it most.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="46" height="46">
        <path d="M30 30 C18 16 8 18 10 28 C12 38 22 36 30 30Z" stroke="#8b5cf6" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M30 30 C42 16 52 18 50 28 C48 38 38 36 30 30Z" stroke="#8b5cf6" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M30 30 C18 44 8 42 10 34" stroke="#8b5cf6" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M30 30 C42 44 52 42 50 34" stroke="#8b5cf6" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="30" cy="30" r="3" fill="#8b5cf6" />
        <path d="M28 27 Q24 20 20 18" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M32 27 Q36 20 40 18" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="17" r="2" fill="#8b5cf6" />
        <circle cx="40" cy="17" r="2" fill="#8b5cf6" />
      </svg>
    ),
  },
];

export function WhatWeDo() {
  const svcRef = useRef(null);
  const [svcVisible, setSvcVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSvcVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    if (svcRef.current) observer.observe(svcRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`svc-section ${svcVisible ? "svc-visible" : ""}`} ref={svcRef} id="services">
      <div className="svc-header">
        <p className="svc-tag">WHAT WE DO</p>
        <h2 className="svc-heading">We Believe that We can Save <br />More Lifes with You</h2>
      </div>
      <div className="svc-grid">
        {SERVICES.map((s, i) => (
          <article key={s.id} className="svc-card" style={{ transitionDelay: `${i * 0.11}s` }}>
            <div className={`svc-icon-wrap ${s.theme}`}>
              <span className="svc-blob svc-blob--base" aria-hidden="true" />
              <span className="svc-blob svc-blob--shine" aria-hidden="true" />
              <span className="svc-icon-svg">{s.icon}</span>
            </div>
            <h3 className="svc-card__title">{s.title}</h3>
            <p className="svc-card__desc">{s.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─── Shared helpers ─── */
function StarRating({ count, color }) {
  return (
    <div className="testi-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" width="16" height="16"
          fill={i < count ? color : "none"} stroke={i < count ? color : "rgba(255,255,255,0.2)"}
          strokeWidth="1.4" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M10 1l2.545 5.16 5.693.827-4.119 4.015.972 5.672L10 14.03l-5.09 2.644.972-5.672L1.762 6.987l5.693-.827z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Testimonials data ─── */
const TESTIMONIALS = [
  {
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    name: "Marvin McKinney", role: "Manager", rating: 5, accent: "#34a853",
    quote: "The transparency and dedication of this team are truly inspiring. They make every donation count.",
    text: "Working with Vidyavaidya has been a privilege. Their commitment to social change is evident in every project they undertake, ensuring that resources reach those who need them most.",
  },
  {
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    name: "Darlene Robertson", role: "Volunteer", rating: 5, accent: "#fbbc04",
    quote: "Every donation made here goes directly to children who need it most. Truly life-changing work.",
    text: "Being a volunteer here has opened my eyes to the incredible impact we can have. Seeing the smiles on the children's faces when they receive help is the greatest reward.",
  },
  {
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    name: "Priya Singh", role: "Donor", rating: 4, accent: "#8b5cf6",
    quote: "I am proud to support an organization that truly cares about the community.",
    text: "Vidyavaidya's approach to community development is holistic and sustainable. I feel confident that my contributions are making a real difference in the lives of many.",
  },
  {
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    name: "Rajesh Kumar", role: "Community Member", rating: 5, accent: "#e05252",
    quote: "The impact Vidyavaidya has made in our village is immeasurable. Thank you!",
    text: "From education to healthcare, the initiatives led by this organization have transformed our village. We are grateful for the hope and opportunity they have brought to our families.",
  },
];

const QuoteIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M10 28c0-6.627 4.477-12 10-12v4c-3.314 0-6 2.686-6 8v8H6V28h4Zm22 0c0-6.627 4.477-12 10-12v4c-3.314 0-6 2.686-6 8v8H28V28h4Z" fill="currentColor" opacity="0.3" />
  </svg>
);

export function Testimonials() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const total = TESTIMONIALS.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);
  const getCardIndex = (offset) => (current + offset + total) % total;

  return (
    <section className={`testi-section ${visible ? "testi-visible" : ""}`} ref={sectionRef} id="testimonials">
      <span className="testi-orb testi-orb--1" aria-hidden="true" />
      <span className="testi-orb testi-orb--2" aria-hidden="true" />
      <span className="testi-orb testi-orb--3" aria-hidden="true" />
      <div className="testi-grid-lines" aria-hidden="true" />

      <div className="testi-header">
        <div className="testi-eyebrow">
          <span className="testi-eyebrow-line" /><span>TESTIMONIALS</span><span className="testi-eyebrow-line" />
        </div>
        <h2 className="testi-heading">What They're <span className="testi-heading-glow">Saying</span><br />About Us?</h2>
        <p className="testi-subtext">Hear from the families and students whose lives have been transformed through our dedicated education programmes.</p>
      </div>

      <div className="testi-stage">
        <article className="testi-card testi-card--featured" key={`main-${current}`} style={{ "--accent": TESTIMONIALS[current].accent }}>
          <QuoteIcon />
          <blockquote className="testi-quote">{TESTIMONIALS[current].quote}</blockquote>
          <StarRating count={TESTIMONIALS[current].rating} color={TESTIMONIALS[current].accent} />
          <div className="testi-author">
            <div className="testi-avatar-wrap">
              <img src={TESTIMONIALS[current].img} alt={TESTIMONIALS[current].name} className="testi-avatar" loading="lazy" />
              <span className="testi-avatar-glow" style={{ background: TESTIMONIALS[current].accent }} />
            </div>
            <div className="testi-author-info">
              <strong className="testi-author-name">{TESTIMONIALS[current].name}</strong>
              <span className="testi-author-role">{TESTIMONIALS[current].role}</span>
            </div>
          </div>
          <span className="testi-card-accent-bar" style={{ background: TESTIMONIALS[current].accent }} />
        </article>

        <article className="testi-card testi-card--peek" key={`peek-${getCardIndex(1)}`} style={{ "--accent": TESTIMONIALS[getCardIndex(1)].accent }} onClick={next}>
          <QuoteIcon />
          <blockquote className="testi-quote">{TESTIMONIALS[getCardIndex(1)].quote}</blockquote>
          <StarRating count={TESTIMONIALS[getCardIndex(1)].rating} color={TESTIMONIALS[getCardIndex(1)].accent} />
          <div className="testi-author">
            <div className="testi-avatar-wrap">
              <img src={TESTIMONIALS[getCardIndex(1)].img} alt={TESTIMONIALS[getCardIndex(1)].name} className="testi-avatar" loading="lazy" />
              <span className="testi-avatar-glow" style={{ background: TESTIMONIALS[getCardIndex(1)].accent }} />
            </div>
            <div className="testi-author-info">
              <strong className="testi-author-name">{TESTIMONIALS[getCardIndex(1)].name}</strong>
              <span className="testi-author-role">{TESTIMONIALS[getCardIndex(1)].role}</span>
            </div>
          </div>
          <span className="testi-card-accent-bar" style={{ background: TESTIMONIALS[getCardIndex(1)].accent }} />
        </article>
      </div>

      <div className="testi-controls">
        <button className="testi-nav-btn" onClick={prev} aria-label="Previous testimonial">
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none"><path d="M13 15l-5-5 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className="testi-dots">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} className={`testi-dot ${i === current ? "active" : ""}`} onClick={() => setCurrent(i)}
              aria-label={`Go to testimonial ${i + 1}`} style={i === current ? { background: TESTIMONIALS[current].accent } : {}} />
          ))}
        </div>
        <button className="testi-nav-btn" onClick={next} aria-label="Next testimonial">
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none"><path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <div className="testi-trust">
        {[{ num: "4.9★", label: "Average Rating" }, { num: "2,400+", label: "Happy Students" }, { num: "98%", label: "Recommend Us" }].map(({ num, label }) => (
          <div className="testi-trust-item" key={label}><strong>{num}</strong><span>{label}</span></div>
        ))}
      </div>
    </section>
  );
}

export function CTABanner() {
  const ctaRef = useRef(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setCtaVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`cta-banner ${ctaVisible ? "cta-visible" : ""}`} ref={ctaRef} id="cta">
      <div className="cta-wave-top" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,0 L0,0 Z" fill="#f7f7f7" />
        </svg>
      </div>
      <span className="cta-deco cta-deco--tl" aria-hidden="true" />
      <span className="cta-deco cta-deco--br" aria-hidden="true" />
      <span className="cta-deco cta-deco--tr" aria-hidden="true" />
      <div className="cta-dots" aria-hidden="true" />
      <div className="cta-inner">
        <div className="cta-icon-badge">
          <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28" aria-hidden="true">
            <path d="M22 38S6 28 6 16a10 10 0 0 1 16-8 10 10 0 0 1 16 8c0 12-16 22-16 22Z" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="cta-eyebrow"><span className="cta-eyebrow-line" aria-hidden="true" />Change The World<span className="cta-eyebrow-line" aria-hidden="true" /></p>
        <h2 className="cta-heading">Join the Community of Over a <span className="cta-heading-accent">Million</span> People</h2>
        <p className="cta-desc">Together we create lasting change — one life, one community, one future at a time. Your support makes all the difference.</p>
        <div className="cta-actions">
          <a href="/donate" className="cta-btn-primary">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="17" height="17" aria-hidden="true" className="cta-btn-icon">
              <path d="M10 2a2 2 0 0 0-2 2v6.5l-1.2-.6a1.5 1.5 0 0 0-2 2l2.5 1.3V16a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-5.6l.5-.4a2 2 0 0 0 .5-1.4V4a2 2 0 0 0-2-2h-3Z" fill="white" />
            </svg>
            Become A Donor
            <span className="cta-btn-shine" aria-hidden="true" />
          </a>
          <a href="/contact" className="cta-btn-outline">
            Become A Volunteer
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true">
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
        <div className="cta-trust">
          {[{ num: "0k+", label: "Volunteers" }, { num: "$0M", label: "Raised" }, { num: "0+", label: "Countries" }].map(({ num, label }) => (
            <div className="cta-trust-item" key={label}><strong>{num}</strong><span>{label}</span></div>
          ))}
        </div>
      </div>
      <div className="cta-wave-bottom" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,20 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
}

const TEAM = [
  {
    id: "t1",
    name: "Chairman & Managing Trustee",
    role: "VidyaVaidya Foundation",
    img: ChairmanImg,
    bio: "A visionary leader more than 15 years of experience in social service and community development. He is the driving force behind VidyaVaidya's mission to provide quality education and healthcare to the underserved. Under his guidance, the foundation has impacted thousands of lives across the nation through sustainable interventions and unwavering dedication."
  },
  {
    id: "t2",
    name: "Secretary",
    role: "VidyaVaidya Foundation",
    img: SecretaryImg,
    bio: "A dedicated administrator and strategist who ensures the smooth operation of all foundation activities. With a background in management and a heart for service, she focuses on building sustainable partnerships and implementing innovative programs that empower youth and children to achieve their full potential."
  },
  {
    id: "t3",
    name: "Treasurer",
    role: "VidyaVaidya Foundation",
    img: TreasurerImg,
    bio: "A financial expert with a passion for transparency and accountability. He manages the foundation's resources with precision, ensuring that every donation is utilized effectively to maximize social impact. His commitment to fiscal responsibility has earned VidyaVaidya the trust and support of global donors."
  },
];


export function TeamMembers() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
    return () => { document.body.style.overflowY = 'auto'; };
  }, [selectedMember]);

  return (
    <section className={`team-section ${visible ? "team-visible" : ""}`} ref={sectionRef} id="team">
      <div className="team-header">
        <div className="team-badge"><span className="team-badge-dot" aria-hidden="true" />OUR LEADERSHIP</div>
        <h2 className="team-heading">Meet the visionaries behind <span className="team-heading-accent">VidyaVaidya</span></h2>
        <p className="team-subtext">Dedicated leaders working every day to bring hope, dignity, and opportunity to communities across the nation.</p>
      </div>
      <div className="team-grid">
        {TEAM.map((member, i) => (
          <article
            key={member.id}
            className="team-card"
            style={{ transitionDelay: `${i * 0.1}s`, cursor: 'pointer' }}
            onClick={() => setSelectedMember(member)}
          >
            <div className="team-image-wrap">
              <img src={member.img} alt={member.name} className="team-member-img" loading="lazy" />
            </div>
            <div className="team-card-body">
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Leadership Modal */}
      {selectedMember && (
        <div className="team-modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="team-modal-content" onClick={e => e.stopPropagation()}>
            <button className="team-modal-close" onClick={() => setSelectedMember(null)} aria-label="Close modal">&times;</button>
            <div className="team-modal-grid">
              <div className="team-modal-image">
                <img src={selectedMember.img} alt={selectedMember.name} />
              </div>
              <div className="team-modal-info">
                <span className="team-modal-badge">Leadership Profile</span>
                <h3 className="team-modal-name">{selectedMember.name}</h3>
                <p className="team-modal-role">{selectedMember.role}</p>
                <div className="team-modal-divider"></div>
                <p className="team-modal-bio">{selectedMember.bio}</p>
                <div className="team-modal-footer">
                  <p>Commitment to Excellence since 2008</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function SimpleTestimonials() {
  const [current, setCurrent] = useState(0);
  const perPage = 2;
  const pages = Math.ceil(TESTIMONIALS.length / perPage);

  return (
    <section className="st-section">
      <div className="st-container">
        <div className="st-left">
          <span className="st-tag">T E S T I M O N I A L S</span>
          <h2 className="st-heading">What They're Say About Us?</h2>
          <p className="st-desc">Our impact is best described by the people we serve. Their stories of resilience and hope drive us to do more every day.</p>
        </div>
        <div className="st-right-container">
          <button
            className="st-nav-btn st-nav-btn--prev"
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
            aria-label="Previous testimonials"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="st-right" style={{ overflow: "hidden" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${TESTIMONIALS.length}, calc(50% - 12px))`,
              gap: "24px",
              transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: `translateX(calc(${current} * (-100% - 24px)))`,
            }}>
              {TESTIMONIALS.map((t, i) => (
                <div className="st-card" key={i}>
                  <div className="st-avatar-wrap">
                    <img src={t.img} alt={t.name} className="st-avatar" />
                    <div className="st-quote-badge">99</div>
                  </div>
                  <p className="st-text">"{t.text}"</p>
                  <div className="st-stars"><StarRating count={5} color="#facc15" /></div>
                  <h4 className="st-name">{t.name}</h4>
                  <p className="st-role">{t.role}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            className="st-nav-btn st-nav-btn--next"
            disabled={current === pages - 1}
            onClick={() => setCurrent((c) => c + 1)}
            aria-label="Next testimonials"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}