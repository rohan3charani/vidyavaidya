import { useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Partners.css";

export default function Partners() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const partners = [
    { id: 1, name: "Apollo Hospitals", category: "Healthcare", description: "Providing free medical consultations" },
    { id: 2, name: "IIT Delhi", category: "Education", description: "Skill training and mentorship programs" },
    { id: 3, name: "Tech for Good", category: "Technology", description: "Digital literacy initiatives" },
    { id: 4, name: "Global NGO Alliance", category: "Community", description: "Community development projects" },
    { id: 5, name: "State Health Department", category: "Government", description: "Healthcare program coordination" },
    { id: 6, name: "Education Ministry", category: "Government", description: "Scholarship and education support" },
  ];

  const partnerCategories = [
    { icon: "🏥", label: "Healthcare Partners", count: 8 },
    { icon: "📚", label: "Educational Partners", count: 12 },
    { icon: "💼", label: "Corporate Partners", count: 15 },
    { icon: "🤝", label: "NGO Partners", count: 10 },
  ];

  return (
    <>
      <Navbar />
      <div className="partners-page">
        {/* Hero Section */}
        <section className="partners-hero">
          <div className="partners-hero-content">
            <h1>Our Partners</h1>
            <p className="partners-subtitle">Working together to create lasting impact</p>
          </div>
        </section>

        {/* Partner Overview */}
        <section className="partner-overview">
          <div className="partner-container">
            <h2 className="section-title">Why We Partner</h2>
            <p className="overview-text">
              Strategic partnerships are at the heart of our mission. We collaborate with healthcare providers, educational institutions, corporations, and community organizations to maximize our impact and reach more lives.
            </p>
            <div className="partner-benefits">
              <div className="benefit">
                <h3>✅ Expanded Reach</h3>
                <p>Access to resources and networks to serve more communities</p>
              </div>
              <div className="benefit">
                <h3>✅ Quality Services</h3>
                <p>Expert collaboration ensures high-quality programs</p>
              </div>
              <div className="benefit">
                <h3>✅ Sustainability</h3>
                <p>Long-term partnerships create sustainable solutions</p>
              </div>
              <div className="benefit">
                <h3>✅ Scalability</h3>
                <p>Together we can scale impact across more regions</p>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Categories */}
        <section className="partner-categories">
          <div className="partner-container">
            <h2 className="section-title">Partnership Categories</h2>
            <div className="categories-grid">
              {partnerCategories.map((cat, idx) => (
                <div key={idx} className="category-card">
                  <div className="category-icon">{cat.icon}</div>
                  <h3>{cat.label}</h3>
                  <p className="category-count">{cat.count} Partners</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners List */}
        <section className="partners-list">
          <div className="partner-container">
            <h2 className="section-title">Our Partner Network</h2>
            <div className="partners-grid">
              {partners.map((partner) => (
                <div key={partner.id} className="partner-card">
                  <div className="partner-badge">{partner.category}</div>
                  <h3>{partner.name}</h3>
                  <p>{partner.description}</p>
                  <button className="partner-btn">Learn More →</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Become a Partner */}
        <section className="become-partner">
          <div className="partner-container">
            <div className="cta-box">
              <h2>Want to Join Our Partnership?</h2>
              <p>Whether you're a healthcare provider, educational institution, corporate, or NGO, we'd love to collaborate with you to create meaningful impact.</p>
              <div className="cta-buttons">
                <button className="btn-primary">Get Involved</button>
                <button className="btn-secondary">Contact Us</button>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Benefits */}
        <section className="partnership-benefits">
          <div className="partner-container">
            <h2 className="section-title">Benefits of Partnership</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <h3>💪 Amplified Impact</h3>
                <p>Reach more beneficiaries and create greater change through collaboration</p>
              </div>
              <div className="benefit-item">
                <h3>📊 Measurable Results</h3>
                <p>Transparent reporting on program outcomes and impact metrics</p>
              </div>
              <div className="benefit-item">
                <h3>🎯 Aligned Mission</h3>
                <p>Work towards shared social impact goals and values</p>
              </div>
              <div className="benefit-item">
                <h3>🌟 Recognition</h3>
                <p>Get recognition as a partner in our foundation's public communications</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
