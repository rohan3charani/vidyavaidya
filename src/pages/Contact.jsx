import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import api from "../services/api";
import "./Pages.css";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const details = [
    { icon: "📧", label: "Email", value: "info@vidyavaidya.org" },
    { icon: "📞", label: "Phone", value: "+91 9966557007 " },
    { 
      icon: "📍", 
      label: "Address", 
      value: (
        <a 
          href="https://www.google.com/maps/search/?api=1&query=CSR+Houses,+Near+YK+Achari+School,+Balaji+Nagar+Main+Road,+Nellore+-+524002" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: "inherit", textDecoration: "none" }}
          onMouseOver={(e) => e.target.style.textDecoration = "underline"}
          onMouseOut={(e) => e.target.style.textDecoration = "none"}
        >
          CSR Houses, Near YK Achari School, Balaji Nagar Main Road, Nellore - 524002
        </a>
      ) 
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.contact.submit({
        name,
        email,
        subject,
        message,
        queryType: "General Inquiry"
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to submit. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper contact-page">
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
                  <form onSubmit={handleSubmit}>
                    <div className="cf-field">
                      <label className="cf-label">Your Name</label>
                      <input 
                        className="cf-input" 
                        type="text" 
                        placeholder="Full Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="cf-field">
                      <label className="cf-label">Email Address</label>
                      <input 
                        className="cf-input" 
                        type="email" 
                        placeholder="you@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="cf-field">
                      <label className="cf-label">Subject</label>
                      <input 
                        className="cf-input" 
                        type="text" 
                        placeholder="How can we help?" 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="cf-field">
                      <label className="cf-label">Message</label>
                      <textarea 
                        className="cf-input cf-textarea" 
                        placeholder="Write your message here..." 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required 
                      />
                    </div>

                    {error && (
                      <div className="cf-error" style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "0.875rem" }}>
                        ⚠ {error}
                      </div>
                    )}

                    <button type="submit" className="cf-submit" disabled={loading}>
                      {loading ? "Sending..." : "Send Message →"}
                    </button>
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
