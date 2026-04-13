import { useEffect, useRef, useState } from "react";
import "./Services.css";

const SERVICES = [
  {
    id: "education",
    iconBg: "icon-circle--pink",
    title: "Education",
    desc: "Amet minim mollit no deserunt ulamco sit enim aliqua dolor sint Velit officia consequt duis enim velit exertation.",
    icon: (
      // Hands holding / cradling a person — outline style, red stroke
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="46" height="46">
        {/* Head */}
        <circle cx="30" cy="16" r="7" stroke="#e05252" strokeWidth="2.4" />
        {/* Body arc (family cradling) */}
        <path d="M16 46 C16 33 44 33 44 46" stroke="#e05252" strokeWidth="2.4" strokeLinecap="round" />
        {/* Cradling arms */}
        <path d="M10 42 C10 35 16 33 22 35" stroke="#e05252" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M50 42 C50 35 44 33 38 35" stroke="#e05252" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="10" cy="38" r="4.5" stroke="#e05252" strokeWidth="2.2" />
        <circle cx="50" cy="38" r="4.5" stroke="#e05252" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    id: "water",
    iconBg: "icon-circle--green",
    title: "Safe Water",
    desc: "Amet minim mollit no deserunt ulamco sit enim aliqua dolor sint Velit officia consequt duis enim velit exertation.",
    icon: (
      // Water drop / bottle icon — white stroke on green
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="46" height="46">
        {/* Water drop shape */}
        <path
          d="M30 8 C22 20 14 27 14 36 a16 16 0 0 0 32 0 C46 27 38 20 30 8Z"
          stroke="#fff" strokeWidth="2.4" strokeLinejoin="round"
        />
        {/* Shine inside drop */}
        <path d="M22 38 Q24 42 30 43" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "food",
    iconBg: "icon-circle--yellow",
    title: "Healthy Food",
    desc: "Amet minim mollit no deserunt ulamco sit enim aliqua dolor sint Velit officia consequt duis enim velit exertation.",
    icon: (
      // Donut / healthy food icon — amber stroke
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="46" height="46">
        {/* Outer donut ring */}
        <circle cx="30" cy="30" r="16" stroke="#c88000" strokeWidth="2.4" />
        {/* Inner hole */}
        <circle cx="30" cy="30" r="7" stroke="#c88000" strokeWidth="2.4" />
        {/* Sprinkle dots */}
        <circle cx="20" cy="24" r="2" fill="#c88000" />
        <circle cx="40" cy="24" r="2" fill="#c88000" />
        <circle cx="16" cy="34" r="2" fill="#c88000" />
        <circle cx="44" cy="34" r="2" fill="#c88000" />
        <circle cx="30" cy="46" r="2" fill="#c88000" />
        {/* Icing drip on top */}
        <path d="M22 17 Q30 13 38 17" stroke="#c88000" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "medical",
    iconBg: "icon-circle--purple",
    title: "Medical Care",
    desc: "Amet minim mollit no deserunt ulamco sit enim aliqua dolor sint Velit officia consequt duis enim velit exertation.",
    icon: (
      // Butterfly / medical butterfly icon — purple stroke
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="46" height="46">
        {/* Top-left wing */}
        <path
          d="M30 30 C18 16 8 18 10 28 C12 38 22 36 30 30Z"
          stroke="#8b5cf6" strokeWidth="2.2" strokeLinejoin="round"
        />
        {/* Top-right wing */}
        <path
          d="M30 30 C42 16 52 18 50 28 C48 38 38 36 30 30Z"
          stroke="#8b5cf6" strokeWidth="2.2" strokeLinejoin="round"
        />
        {/* Bottom-left wing */}
        <path
          d="M30 30 C18 44 8 42 10 34"
          stroke="#8b5cf6" strokeWidth="2.2" strokeLinecap="round"
        />
        {/* Bottom-right wing */}
        <path
          d="M30 30 C42 44 52 42 50 34"
          stroke="#8b5cf6" strokeWidth="2.2" strokeLinecap="round"
        />
        {/* Body dot */}
        <circle cx="30" cy="30" r="3" fill="#8b5cf6" />
        {/* Antennae */}
        <path d="M28 27 Q24 20 20 18" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M32 27 Q36 20 40 18" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="17" r="2" fill="#8b5cf6" />
        <circle cx="40" cy="17" r="2" fill="#8b5cf6" />
      </svg>
    ),
  },
];

export default function Services() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`services-section ${visible ? "services-visible" : ""}`}
      ref={ref}
      id="services"
    >
      {/* ── Header ── */}
      <div className="services-header">
        <p className="services-tag">WHAT WE DO</p>
        <h2 className="services-heading">
          We Believe that We can Save <br />
          More Lifes with You
        </h2>
      </div>

      {/* ── Cards ── */}
      <div className="services-grid">
        {SERVICES.map((s, i) => (
          <article
            key={s.id}
            className="service-card"
            style={{ transitionDelay: `${i * 0.11}s` }}
          >
            {/* Brushstroke circle with icon */}
            <div className={`service-icon-wrap ${s.iconBg}`}>
              {/* Organic painted blob layer 1 */}
              <span className="brush-blob brush-blob--1" aria-hidden="true" />
              {/* Organic painted blob layer 2 (lighter, rotated) */}
              <span className="brush-blob brush-blob--2" aria-hidden="true" />
              {/* SVG icon on top */}
              <span className="brush-icon">{s.icon}</span>
            </div>

            <h3 className="service-card__title">{s.title}</h3>
            <p className="service-card__desc">{s.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
