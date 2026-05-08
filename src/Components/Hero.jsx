import React, { useState, useEffect, useRef, useCallback } from "react";
import shape2 from "../assets/hero/shape-2.png";
import shape3 from "../assets/hero/shape-3.png";
import shape  from "../assets/hero/shape.png";
import Bg     from "../assets/bg/01.jpg";
import Bg2    from "../assets/bg/1.jpg";
import Bg3    from "../assets/bg/2.jpg";
import Bg4    from "../assets/bg/3.jpg";  

import "./Hero.css";

/* ─────────────────────────────────────────
   HERO CONFIG — edit text / links here only
───────────────────────────────────────────*/
const HERO = {
  tagline    : "Non - Profit Charity",
  heading    : (<>Make Someone's <br />Life By Giving Of <br />Yours's.</>),
  primaryBtn : { label: "Join With Us \u2197", href: "#contact" },
  videoBtn   : { href: "https://www.youtube.com/watch?v=Cn4G2lZ_g2I", label: "Video Playing Theme" },
};

/* ─────────────────────────────────────────
   HERO BACKGROUND IMAGES — add/remove here
───────────────────────────────────────────*/
const BG_IMAGES = [Bg, Bg2, Bg3, Bg4];

/* ─── Main Hero Component ─── */
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [prev,    setPrev]    = useState(null);
  const [paused,  setPaused]  = useState(false);
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
            <a href={HERO.primaryBtn.href} className="hero-btn-primary">
              {HERO.primaryBtn.label}
            </a>
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
    desc: "Amet minim mollit no deserunt ulamco sit enim aliqua dolor sint Velit officia consequt duis enim velit exertation.",
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
    desc: "Amet minim mollit no deserunt ulamco sit enim aliqua dolor sint Velit officia consequt duis enim velit exertation.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="46" height="46">
        <path d="M30 8 C22 20 14 27 14 36 a16 16 0 0 0 32 0 C46 27 38 20 30 8Z" stroke="#ffffff" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M22 38 Q24 42 30 43" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "food", theme: "svc-yellow", title: "Healthy Food",
    desc: "Amet minim mollit no deserunt ulamco sit enim aliqua dolor sint Velit officia consequt duis enim velit exertation.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="46" height="46">
        <circle cx="30" cy="30" r="16" stroke="#b87800" strokeWidth="2.4" />
        <circle cx="30" cy="30" r="7"  stroke="#b87800" strokeWidth="2.4" />
        <circle cx="20" cy="24" r="2"  fill="#b87800" />
        <circle cx="40" cy="24" r="2"  fill="#b87800" />
        <circle cx="16" cy="34" r="2"  fill="#b87800" />
        <circle cx="44" cy="34" r="2"  fill="#b87800" />
        <circle cx="30" cy="46" r="2"  fill="#b87800" />
        <path d="M22 17 Q30 13 38 17" stroke="#b87800" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "medical", theme: "svc-purple", title: "Medical Care",
    desc: "Amet minim mollit no deserunt ulamco sit enim aliqua dolor sint Velit officia consequt duis enim velit exertation.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="46" height="46">
        <path d="M30 30 C18 16 8 18 10 28 C12 38 22 36 30 30Z"  stroke="#8b5cf6" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M30 30 C42 16 52 18 50 28 C48 38 38 36 30 30Z" stroke="#8b5cf6" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M30 30 C18 44 8 42 10 34"  stroke="#8b5cf6" strokeWidth="2.2" strokeLinecap="round" />
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
              <span className="svc-blob svc-blob--base"  aria-hidden="true" />
              <span className="svc-blob svc-blob--shine" aria-hidden="true" />
              <span className="svc-icon-svg">{s.icon}</span>
            </div>
            <h3 className="svc-card__title">{s.title}</h3>
            <p  className="svc-card__desc">{s.desc}</p>
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
    quote: "Mattis cras magna morb nulla punar aenean aliquet in. Risus a arcu eget mi hendrerit gravida elit scelerisque tempor.",
    text: "Mattis cras magna morb nulla punar aenean aliquet in. Risus a arcu eget mi hendrerit gravida elit scelerisque tempor Pharetra fringilla tellus vivera eget sapien viverra faucibus facilisis sed facilisi dictum.",
  },
  {
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    name: "Darlene Robertson", role: "Volunteer", rating: 5, accent: "#fbbc04",
    quote: "Every donation made here goes directly to children who need it most. Truly life-changing work.",
    text: "Mattis cras magna morb nulla punar aenean aliquet in. Risus a arcu eget mi hendrerit gravida elit scelerisque tempor Pharetra fringilla tellus vivera eget sapien viverra faucibus facilisis sed facilisi dictum.",
  },
  {
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    name: "Priya Singh", role: "Donor", rating: 4, accent: "#8b5cf6",
    quote: "I am proud to support an organization that truly cares about the community.",
    text: "Mattis cras magna morb nulla punar aenean aliquet in. Risus a arcu eget mi hendrerit gravida elit scelerisque tempor Pharetra fringilla tellus vivera eget sapien viverra faucibus facilisis sed facilisi dictum.",
  },
  {
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    name: "Rajesh Kumar", role: "Community Member", rating: 5, accent: "#e05252",
    quote: "The impact Vidyavaidya has made in our village is immeasurable. Thank you!",
    text: "Mattis cras magna morb nulla punar aenean aliquet in. Risus a arcu eget mi hendrerit gravida elit scelerisque tempor Pharetra fringilla tellus vivera eget sapien viverra faucibus facilisis sed facilisi dictum.",
  },
];

const QuoteIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M10 28c0-6.627 4.477-12 10-12v4c-3.314 0-6 2.686-6 8v8H6V28h4Zm22 0c0-6.627 4.477-12 10-12v4c-3.314 0-6 2.686-6 8v8H28V28h4Z" fill="currentColor" opacity="0.3"/>
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
            <path d="M22 38S6 28 6 16a10 10 0 0 1 16-8 10 10 0 0 1 16 8c0 12-16 22-16 22Z" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="cta-eyebrow"><span className="cta-eyebrow-line" aria-hidden="true" />Change The World<span className="cta-eyebrow-line" aria-hidden="true" /></p>
        <h2 className="cta-heading">Join the Community of Over a <span className="cta-heading-accent">Million</span> People</h2>
        <p className="cta-desc">Together we create lasting change — one life, one community, one future at a time. Your support makes all the difference.</p>
        <div className="cta-actions">
          <a href="/donate" className="cta-btn-primary">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="17" height="17" aria-hidden="true" className="cta-btn-icon">
              <path d="M10 2a2 2 0 0 0-2 2v6.5l-1.2-.6a1.5 1.5 0 0 0-2 2l2.5 1.3V16a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-5.6l.5-.4a2 2 0 0 0 .5-1.4V4a2 2 0 0 0-2-2h-3Z" fill="white"/>
            </svg>
            Become A Donor
            <span className="cta-btn-shine" aria-hidden="true" />
          </a>
          <a href="/contact" className="cta-btn-outline">
            Become A Volunteer
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true">
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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
  { id: "t1", name: "Sarah Johnson",  role: "Executive Director", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80", socials: { twitter: "#", whatsapp: "#", instagram: "#", telegram: "#" } },
  { id: "t2", name: "Daniel Carter",  role: "Community Lead",     img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80", socials: { twitter: "#", whatsapp: "#", instagram: "#", telegram: "#" } },
  { id: "t3", name: "Priya Mehta",    role: "Field Coordinator",  img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80", socials: { twitter: "#", whatsapp: "#", instagram: "#", telegram: "#" } },
  { id: "t4", name: "Marcus Lee",     role: "Outreach Manager",   img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80", socials: { twitter: "#", whatsapp: "#", instagram: "#", telegram: "#" } },
];

const TwitterIcon   = () => <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const WhatsAppIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.559 4.122 1.533 5.854L.057 23.57a.5.5 0 0 0 .614.614l5.78-1.476A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.658-.523-5.166-1.431l-.369-.22-3.832.978.998-3.768-.24-.386A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>;
const InstagramIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>;
const TelegramIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>;

export function TeamMembers() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`team-section ${visible ? "team-visible" : ""}`} ref={sectionRef} id="team">
      <div className="team-header">
        <div className="team-badge"><span className="team-badge-dot" aria-hidden="true" />TEAM MEMBERS</div>
        <h2 className="team-heading">Meet the optimistic <span className="team-heading-accent">volunteer</span></h2>
        <p className="team-subtext">Passionate individuals working every day to bring hope, dignity, and opportunity to communities around the world.</p>
      </div>
      <div className="team-grid">
        {TEAM.map((member, i) => (
          <article key={member.id} className="team-card" style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="team-avatar-wrap">
              <img src={member.img} alt={member.name} className="team-avatar" loading="lazy" />
              <span className="team-avatar-ring" aria-hidden="true" />
            </div>
            <div className="team-card-body">
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <span className="team-divider" aria-hidden="true" />
              <div className="team-socials">
                <a href={member.socials.twitter}   className="team-social team-social--twitter"   aria-label="Twitter"   rel="noopener noreferrer"><TwitterIcon   /></a>
                <a href={member.socials.whatsapp}  className="team-social team-social--whatsapp"  aria-label="WhatsApp"  rel="noopener noreferrer"><WhatsAppIcon  /></a>
                <a href={member.socials.instagram} className="team-social team-social--instagram" aria-label="Instagram" rel="noopener noreferrer"><InstagramIcon /></a>
                <a href={member.socials.telegram}  className="team-social team-social--telegram"  aria-label="Telegram"  rel="noopener noreferrer"><TelegramIcon  /></a>
              </div>
            </div>
          </article>
        ))}
      </div>
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
          <p className="st-desc">Amet dui scelerisque vel habitant eget tincidunt facilisis pretium. Porttitor mi nisi, non vitae tempus.</p>
          <div className="st-nav">
            <button className="st-nav-btn" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button className="st-nav-btn" disabled={current === pages - 1} onClick={() => setCurrent((c) => c + 1)}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
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
      </div>
    </section>
  );
}