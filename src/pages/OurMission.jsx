import { useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./OurMission.css";

export default function OurMission() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="mission-page">
        {/* Hero Section */}
        <section className="mission-hero">
          <div className="mission-hero-content">
            <h1>Our Mission & Vision</h1>
            <p className="mission-subtitle">Empowering lives through education, healthcare, and dignity</p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="mission-statement">
          <div className="mission-container">
            <div className="mission-card">
              <h2>Our Mission</h2>
              <p>
                Vidya Vaidya Foundation is dedicated to supporting underprivileged children by providing access to quality education and healthcare. We believe that every child deserves the opportunity to learn, grow, and thrive regardless of their socioeconomic background.
              </p>
              <p>
                Together, we can build a healthier and brighter future for all by ensuring access to quality healthcare, education, and community welfare programs.
              </p>
            </div>

            <div className="mission-card">
              <h2>Our Vision</h2>
              <p>
                To create a world where every child has access to quality education and healthcare, enabling them to realize their full potential and contribute meaningfully to society.
              </p>
              <p>
                We envision a society where knowledge, care, and dignity are not privileges but rights for every child.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="core-values">
          <div className="mission-container">
            <h2 className="section-title">Our Core Values</h2>
            <div className="values-grid">
              <div className="value-card">
<div className="value-icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
  <span style={{fontSize: '40px'}}>📚</span>
</div>
                <h3>Knowledge</h3>
                <p>Providing quality education and fostering lifelong learning opportunities for underprivileged children.</p>
              </div>
              <div className="value-card">
<div className="value-icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
  <span style={{fontSize: '40px'}}>❤️</span>
</div>
                <h3>Care</h3>
                <p>Delivering compassionate healthcare and wellness support to those in need within our communities.</p>
              </div>
              <div className="value-card">
<div className="value-icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
  <span style={{fontSize: '40px'}}>👑</span>
</div>
                <h3>Dignity</h3>
                <p>Treating every individual with respect and ensuring programs that empower and uplift communities.</p>
              </div>
              <div className="value-card">
<div className="value-icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
  <span style={{fontSize: '40px'}}>🤝</span>
</div>
                <h3>Collaboration</h3>
                <p>Working with partners, donors, and volunteers to create sustainable and impactful change.</p>
              </div>
              <div className="value-card">
<div className="value-icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
  <span style={{fontSize: '40px'}}>💎</span>
</div>
                <h3>Transparency</h3>
                <p>Maintaining accountability and transparency in all our operations and fund utilization.</p>
              </div>
              <div className="value-card">
<div className="value-icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
  <span style={{fontSize: '40px'}}>🌱</span>
</div>
                <h3>Sustainability</h3>
                <p>Building long-term, sustainable programs that create lasting positive impact in communities.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Areas */}
        <section className="impact-areas">
          <div className="mission-container">
            <h2 className="section-title">Our Impact Areas</h2>
            <div className="impact-grid">
              <div className="impact-item">
<img src="https://images.unsplash.com/photo-1524178232363-933d95f6837f?w=400&q=80&fm=auto" alt="Education" className="impact-image" />
<h3>Education</h3>
                <ul>
                  <li>Scholarships for underprivileged students</li>
                  <li>Educational infrastructure development</li>
                  <li>Skill training and vocational programs</li>
                  <li>Digital literacy initiatives</li>
                </ul>
              </div>
              <div className="impact-item">
<img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80&fm=auto" alt="Healthcare" className="impact-image" />
<h3>Healthcare</h3>
                <ul>
                  <li>Free medical camps and health checkups</li>
                  <li>Emergency medical assistance</li>
                  <li>Health awareness programs</li>
                  <li>Support for surgical treatments</li>
                </ul>
              </div>
              <div className="impact-item">
<img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&q=80&fm=auto&fit=crop" alt="Community Welfare" className="impact-image" />
<h3>Community Welfare</h3>
                <ul>
                  <li>Food and nutrition programs</li>
                  <li>Community capacity building</li>
                  <li>Women empowerment initiatives</li>
                  <li>Disaster relief support</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mission-stats">
          <div className="mission-container">
            <div className="stat">
              <h3>5000+</h3>
              <p>Children Supported</p>
            </div>
            <div className="stat">
              <h3>50+</h3>
              <p>Partner Organizations</p>
            </div>
            <div className="stat">
              <h3>₹10 Cr+</h3>
              <p>Impact Created</p>
            </div>
            <div className="stat">
              <h3>25+</h3>
              <p>Villages Reached</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
