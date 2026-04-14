import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Pages.css";

export default function Partners() {
  const partners = [
    { id: 1, name: "Global Health Care", type: "Hospital", logo: "🏥" },
    { id: 2, name: "Tech For Good Inc.", type: "Corporate Sponsor", logo: "💻" },
    { id: 3, name: "Visionary Foundation", type: "NGO", logo: "🤝" },
    { id: 4, name: "City Medical Institute", type: "Hospital", logo: "⚕️" },
    { id: 5, name: "EduGrow Alliance", type: "NGO", logo: "🎓" },
    { id: 6, name: "Apex Financial Group", type: "Corporate Sponsor", logo: "📈" }
  ];

  return (
    <div className="page-wrapper">
      <Navbar />

      <section className="page-hero">
        <span className="page-hero-tag">Collaborations</span>
        <h1>Our Trusted Partners</h1>
        <p>Together with our partners, we amplify our impact and reach thousands of underserved individuals. We are deeply grateful for their continued support.</p>
      </section>

      <section className="page-section">
        <div className="page-container">
          <div className="partners-grid">
            {partners.map(p => (
              <div key={p.id} className="partner-card">
                <span className="partner-logo">{p.logo}</span>
                <h3 className="partner-name">{p.name}</h3>
                <span className="partner-badge">{p.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
