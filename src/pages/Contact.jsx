import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Pages.css";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const details = [
    { icon: Mail, label: "Email", value: "info@vidyavaidya.org" },
    { icon: Phone, label: "Phone", value: "+91 9966557007 " },
    { 
      icon: MapPin, 
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
              <div className="space-y-10 mt-8">
                {details.map((d, index) => {
                  const IconComponent = d.icon;
                  const isLast = index === details.length - 1;
                  return (
                    <div 
                      key={d.label} 
                      className={`flex items-start gap-5 ${!isLast ? "border-b border-white/20 pb-8" : ""}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md shrink-0 transition-transform duration-300 hover:scale-105 cursor-pointer">
                        <IconComponent 
                          className="w-5.5 h-5.5 text-[#123B7A]" 
                          strokeWidth={2}
                        />
                      </div>
                      <div className="flex flex-col justify-center space-y-1">
                        <div className="text-white/70 tracking-wide font-semibold text-[0.8rem] uppercase m-0 leading-none">{d.label}</div>
                        <div className="text-white text-[0.95rem] font-medium leading-normal m-0">{d.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
