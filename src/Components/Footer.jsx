import React from 'react';
import './Footer.css';
import vidyaLogo from '../assets/Vidya1.png';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Column 1: Brand & Description */}
        <div className="footer-col col-brand">
          <div className="footer-logo-wrapper">
            <img src={vidyaLogo} alt="VIDYA-VAIDYA FOUNDATION" className="footer-logo" style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
            <span className="footer-brand-text">VIDYA-VAIDYA FOUNDATION</span>
          </div>
          <p className="footer-desc">
            To bring about a significant positive change in the socio-economic status of the rural
            society by offering quality education to the deserving individual.
          </p>
          <div className="footer-hashtag">#change a life</div>
          <div className="footer-badges">
            <div className="footer-badge">
              <span className="badge-icon badge-icon-green">🔒</span>
              <div className="badge-text">
                <strong>SECURE</strong>
                <strong>SSL ENCRYPTION</strong>
              </div>
            </div>
            <div className="footer-badge">
              <span className="badge-icon badge-icon-blue">💳</span>
              <div className="badge-text">
                <strong>Payments Powered by</strong>
                <strong>Razorpay</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/mission">Our Mission</Link></li>
            <li><Link to="/mission">Our Journey</Link></li>
            <li><Link to="/PhotoGallery">Photo Gallery</Link></li>
            <li><Link to="/partners">Partners</Link></li>
          </ul>
        </div>

        {/* Column 3: Important Links & Address */}
        <div className="footer-col">
          <h4 className="footer-heading">Important Links</h4>
          <ul className="footer-links">
            <li><Link to="/Ourvolunteers">Our Volunteers</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/news">News & Events</Link></li>
          </ul>

          <h4 className="footer-heading footer-heading-spaced">Office Address:</h4>
          <p className="footer-address">
            CSR Houses, Near YK Achari School, Balaji Nagar Main Road, Nellore - 524002
          </p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=CSR+Houses,+Near+YK+Achari+School,+Balaji+Nagar+Main+Road,+Nellore+-+524002"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-map-btn"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            View Location in Map
          </a>
        </div>

        {/* Column 4: App & Support */}
        <div className="footer-col">

          <h4 className="footer-heading footer-heading-spaced">Support</h4>
          <ul className="footer-contact">
            <li>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <a href="mailto:vidyavaidyanlr@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>vidyavaidyanlr@gmail.com</a>
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <a href="tel:+919966557007" style={{ color: 'inherit', textDecoration: 'none' }}>+91 9966557007</a>
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <a href="tel:+919966557021" style={{ color: 'inherit', textDecoration: 'none' }}>+91 9966557021</a>
            </li>
            <li>
              {/* <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              <span>+91 9966557007</span> */}
            </li>
          </ul>

          <div className="footer-socials">
            <a href="#" className="social-icon" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.73 16h5L9 4z"></path></svg>
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="#" className="social-icon" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          Copyright © 2026 <strong>VIDYA-VAIDYA FOUNDATION</strong>. All Rights Reserved.
        </p>
        <p className="footer-design">
          Designed & Developed by <span className="design-brand"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4, verticalAlign: 'middle', color: '#0dcaf0' }}><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>RohanTech</span>
        </p>
      </div>
    </footer>
  );
}
