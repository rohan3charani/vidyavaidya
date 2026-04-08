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
      {/* Subtle background blobs */}
      <div className="about-bg-blob about-bg-blob--1" aria-hidden="true" />
      <div className="about-bg-blob about-bg-blob--2" aria-hidden="true" />

      <div className="about-container">
        {/* ── LEFT CONTENT ── */}
        <div className="about-left">
          <p className="about-tag">About Trusthand</p>

          <h2 className="about-heading">
            Our Mission Is to <br />
            <span className="about-heading--accent">Change The World</span>
          </h2>

          <p className="about-desc">
            We believe every child deserves access to quality education,
            healthcare, and a safe environment. Through community-driven
            initiatives, we transform lives one family at a time.
          </p>

          {/* Feature cards */}
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

          <a href="#contact" className="about-btn" aria-label="Contact Us">
            Contact Us
            <span className="about-btn__arrow" aria-hidden="true">→</span>
          </a>
        </div>

        {/* ── RIGHT IMAGES ── */}
        <div className="about-right" aria-hidden="true">
          {/* Dotted pattern */}
          <div className="about-dots" />

          {/* Yellow ring */}
          <div className="about-ring" />

          {/* Large circle image */}
          <div className="about-img about-img--large">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&q=80"
              alt="Volunteers with children"
              loading="lazy"
            />
          </div>

          {/* Small overlapping circle image */}
          <div className="about-img about-img--small">
            <img
              src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&q=80"
              alt="Volunteer mentoring a child"
              loading="lazy"
            />
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
