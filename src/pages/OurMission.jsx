import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Pages.css";

export default function OurMission() {
  const pillars = [
    { id: 1, title: "Educate", icon: "📚", description: "Providing quality education and resources to underprivileged children to help them build a foundation for a brighter future. We distribute books, scholarships, and school kits." },
    { id: 2, title: "Heal", icon: "❤️", description: "Delivering essential healthcare services, organizing free medical camps, and providing critical treatments to vulnerable communities across India." },
    { id: 3, title: "Empower", icon: "🌱", description: "Conducting skill development and vocational training programs to foster economic independence and social inclusion for women and youth." }
  ];

  const stats = [
    { number: "15K+", label: "Lives Impacted" },
    { number: "5K+", label: "Students Supported" },
    { number: "2K+", label: "Medical Cases" },
    { number: "200+", label: "Volunteers" }
  ];

  return (
    <div className="page-wrapper">
      <Navbar />

      <section className="page-hero">
        <div className="relative z-10">
          <span className="page-hero-tag">Who We Are</span>
          <h1>Our Mission</h1>
          <p>
            VidyaVaidya is dedicated to transforming lives through holistic interventions in education and healthcare. 
            We envision a world where every individual has the opportunity to thrive.
          </p>
        </div>
      </section>

      <section className="page-section" style={{ background: "#f8fafc" }}>
        <div className="page-container">
          <div className="mission-pillars">
            {pillars.map(p => (
              <div key={p.id} className="mission-pillar-card">
                <span className="mission-pillar-icon">{p.icon}</span>
                <h3 className="mission-pillar-title">{p.title}</h3>
                <p className="mission-pillar-desc">{p.description}</p>
              </div>
            ))}
          </div>

          <div className="mission-stats-row">
            {stats.map(s => (
              <div key={s.label} className="mission-stat-box">
                <span className="mission-stat-number">{s.number}</span>
                <span className="mission-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
