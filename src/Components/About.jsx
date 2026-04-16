import { useEffect, useRef, useState } from "react";
import "./About.css";

const FEATURES = [
  {
    id: "fundraising",
    emoji: "💰",
    iconBg: "icon-bg--gold",
    title: "Quick Fundraising",
    desc: "We mobilize resources rapidly to get aid where it's needed most, with full transparency.",
  },
  {
    id: "team",
    emoji: "🤝",
    iconBg: "icon-bg--purple",
    title: "Join Our Team",
    desc: "Become a volunteer and be part of a movement that creates real, lasting change.",
  },
];

/*
  ── HOW TO ADD LOCAL IMAGES ──────────────────────────────────────────────
  OPTION A – Public folder (no import needed):
    { src: "/about/photo1.jpg", alt: "Description" }

  OPTION B – Import at top of file:
    import img1 from "./assets/photo1.jpg";
    then use: { src: img1, alt: "Description" }

  Just replace or add entries in the array below.
  ─────────────────────────────────────────────────────────────────────── */
const ABOUT_IMAGES = [
  { src: "src/assets/bg/1.jpg", alt: "Volunteers with children" },
  { src: "src/assets/bg/2.jpg", alt: "Volunteer mentoring a child" },
  { src: "src/assets/bg/3.jpg", alt: "Community outreach" },
  { src: "src/assets/bg/01.jpg", alt: "Children learning" },
  { src: "src/assets/bg/02.jpg", alt: "Food distribution" },
  { src: "src/assets/bg/03.jpg", alt: "Charity event" },
  // ← Add more: { src: "/about/photo7.jpg", alt: "Your description" }
];

function AboutImageCarousel() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const total = ABOUT_IMAGES.length;

  const goTo = (index) => {
    if (index === current || transitioning) return;
    setPrev(current);
    setCurrent(index);
    setTransitioning(true);
    setTimeout(() => {
      setPrev(null);
      setTransitioning(false);
    }, 900);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % total);
    }, 3000);
    return () => clearInterval(timer);
  }, [current, transitioning]);

  return (
    <>
      {/* Outgoing image */}
      {prev !== null && (
        <img
          key={`prev-${prev}`}
          src={ABOUT_IMAGES[prev].src}
          alt={ABOUT_IMAGES[prev].alt}
          className="about-carousel__img about-carousel__img--out"
        />
      )}
      {/* Incoming image */}
      <img
        key={`curr-${current}`}
        src={ABOUT_IMAGES[current].src}
        alt={ABOUT_IMAGES[current].alt}
        className="about-carousel__img about-carousel__img--in"
      />

      {/* Navigation dots */}
      <div className="about-carousel__dots">
        {ABOUT_IMAGES.map((_, i) => (
          <button
            key={i}
            className={`about-carousel__dot${i === current ? " about-carousel__dot--active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`about-section ${visible ? "about-visible" : ""}`}
      ref={sectionRef}
      id="about"
    >
      <div className="about-bg-blob about-bg-blob--1" aria-hidden="true" />
      <div className="about-bg-blob about-bg-blob--2" aria-hidden="true" />

      <div className="about-container">
        {/* ── LEFT CONTENT ── */}
        <div className="about-left">
          <p className="about-tag">About Vidyavaidya</p>

          <h2 className="about-heading">
            Our Mission Is to <br />
            <span className="about-heading--accent">Change The World</span>
          </h2>

          <p className="about-desc">
            We believe every child deserves access to quality education,
            healthcare, and a safe environment. Through community-driven
            initiatives, we transform lives one family at a time.
          </p>

          <div className="about-features">
            {FEATURES.map((f, i) => (
              <div
                key={f.id}
                className="about-feature"
                style={{ transitionDelay: `${0.4 + i * 0.15}s` }}
              >
                <div className={`about-feature__icon ${f.iconBg}`}>
                  <span>{f.emoji}</span>
                </div>
                <div className="about-feature__text">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <a href="/contact" className="about-btn" aria-label="Contact Us">
            Contact Us
            <span className="about-btn__arrow" aria-hidden="true">→</span>
          </a>
        </div>

        {/* ── RIGHT — Single large hero circle ── */}
        <div className="about-right" aria-label="Image gallery">
          <div className="about-dots" aria-hidden="true" />
          <div className="about-ring" aria-hidden="true" />

          {/* Hero circle */}
          <div className="about-img about-img--hero">
            <AboutImageCarousel />
          </div>

          {/* Stats badge */}
          <div className="about-badge">
            <span className="about-badge__number">12K+</span>
            <span className="about-badge__label">Lives Changed</span>
          </div>
        </div>
      </div>
    </section>
  );
}