import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./FormLayout.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function FormLayout({ 
  title, 
  heroTitle, 
  heroSubtext, 
  imageSrc, 
  quote, 
  children 
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="form-page">
        <div className="form-container">
          {/* LEFT SIDE: Visual Storytelling */}
          <div className="left-section">
            <img 
              src={imageSrc} 
              alt="visual" 
              className="visual-image" 
              loading="eager" 
            />
            <div className="visual-content">
              <h2 className="fade-in-up">{heroTitle}</h2>
              <p className="fade-in-up delay-1">{heroSubtext}</p>
              {quote && (
                <blockquote className="fade-in-up delay-2">
                  "{quote}"
                </blockquote>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Form Section */}
          <div className="right-section">
            <Link to="/join-community" className="back-link">
              <ArrowLeft size={16} /> Back to Community
            </Link>
            
            <div className="form-premium-header">
              <h3>{title}</h3>
            </div>

            <div className="form-fields-container">
              {children}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
