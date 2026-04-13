import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./FormLayout.css";

export default function FormLayout({ title, heroTitle, heroSubtext, quote, imageSrc, children }) {
  const navigate = useNavigate();

  return (
    <div className="form-layout-wrapper">
      <Navbar />
      <main className="form-layout-main">
        <div className="form-layout-hero" style={{ backgroundImage: `url(${imageSrc})` }}>
          <div className="form-layout-hero-overlay"></div>
          <div className="form-layout-hero-content">
            <h1 className="hero-title">{heroTitle}</h1>
            {heroSubtext && <p className="hero-subtext">{heroSubtext}</p>}
            {quote && <p className="hero-quote">"{quote}"</p>}
          </div>
        </div>

        <section className="form-layout-content-section">
          <div className="form-container">
            <button className="back-link-btn" onClick={() => navigate("/join-community")}>
              <ArrowLeft size={16} /> Back to Community
            </button>
            <div className="form-header">
              <h2 className="form-title">{title}</h2>
              <div className="title-underline"></div>
            </div>
            
            <div className="form-body">
              {children}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
