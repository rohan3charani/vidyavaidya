import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Pages.css";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const details = [
    { icon: "📧", label: "Email", value: "contact@vidyavaidya.org" },
    { icon: "📞", label: "Phone", value: "+91 98765 43210" },
    { icon: "📍", label: "Address", value: "1A, Mission Road, Bengaluru, Karnataka 560001" }
  ];

  return (
    <div className="page-wrapper">
      <Navbar />

      <section className="page-hero">
        <span className="page-hero-tag">Get In Touch</span>
        <h1>Contact Us</h1>
        <p>Have a question or want to collaborate? We'd love to hear from you. Reach out and our team will respond promptly.</p>
      </section>

      <section className="page-section" style={{ background: "#f8fafc" }}>
        <div className="page-container">
          <div className="contact-layout">

            {/* Info Side */}
            <div className="contact-info-box">
              <h2>Let's Make an Impact Together</h2>
              <p>Whether you're looking to volunteer, donate, or start a partnership — every conversation matters.</p>
              {details.map(d => (
                <div key={d.label} className="contact-detail-item">
                  <div className="contact-detail-icon">{d.icon}</div>
                  <div>
                    <p className="contact-detail-label">{d.label}</p>
                    <p className="contact-detail-value">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Side */}
            <div className="contact-form-box">
              {submitted ? (
                <div className="contact-success">
                  <span className="contact-success-icon">✅</span>
                  <h3>Message sent successfully!</h3>
                  <p>Thank you for reaching out. We will get back to you within 2–3 business days.</p>
                </div>
              ) : (
                <>
                  <h2>Send a Message</h2>
                  <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                    <div className="cf-field">
                      <label className="cf-label">Your Name</label>
                      <input className="cf-input" type="text" placeholder="Full Name" required />
                    </div>
                    <div className="cf-field">
                      <label className="cf-label">Email Address</label>
                      <input className="cf-input" type="email" placeholder="you@example.com" required />
                    </div>
                    <div className="cf-field">
                      <label className="cf-label">Subject</label>
                      <input className="cf-input" type="text" placeholder="How can we help?" required />
                    </div>
                    <div className="cf-field">
                      <label className="cf-label">Message</label>
                      <textarea className="cf-input cf-textarea" placeholder="Write your message here..." required />
                    </div>
                    <button type="submit" className="cf-submit">Send Message →</button>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
