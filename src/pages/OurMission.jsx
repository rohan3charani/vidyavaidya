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

      <section className="relative pt-32 pb-24 px-6 lg:px-20 overflow-hidden bg-gradient-to-br from-green-600 via-teal-700 to-blue-900 text-white text-center">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-cyan-400/20 blur-[120px]"></div>
        </div>
        
        <div className="relative z-10">
          <span className="inline-flex rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200 mb-6">Who We Are</span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">Our Mission</h1>
          <p className="mx-auto max-w-2xl text-base text-teal-50 sm:text-xl font-medium italic mt-4">VidyaVaidya is dedicated to transforming lives through holistic interventions in education and healthcare. We envision a world where every individual has the opportunity to thrive.</p>
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
