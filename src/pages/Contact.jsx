import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Contact.css";

export default function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const offices = [
    {
      city: "Delhi",
      address: "Plot No. 123, Green Colony, New Delhi - 110001",
      phone: "+91-11-XXXX-XXXX",
      email: "delhi@vidyavaidya.org",
    },
    {
      city: "Mumbai",
      address: "Office No. 456, Marine Building, Mumbai - 400001",
      phone: "+91-22-XXXX-XXXX",
      email: "mumbai@vidyavaidya.org",
    },
    {
      city: "Bangalore",
      address: "Suite 789, Tech Park, Bangalore - 560001",
      phone: "+91-80-XXXX-XXXX",
      email: "bangalore@vidyavaidya.org",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="contact-hero-content">
            <h1>Get In Touch</h1>
            <p className="contact-subtitle">We'd love to hear from you</p>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className="contact-main">
          <div className="contact-container">
            <div className="contact-content">
              {/* Contact Form */}
              <div className="contact-form-wrapper">
                <h2>Send us a Message</h2>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label>Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enter subject"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Enter your message"
                      rows="6"
                      required
                    />
                  </div>

                  <button type="submit" className="submit-btn">Send Message</button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="contact-info-wrapper">
                <h2>Contact Information</h2>
                <div className="contact-info">
                  <div className="info-item">
                    <div className="info-icon">📧</div>
                    <div>
                      <h3>Email</h3>
                      <p><a href="mailto:info@vidyavaidya.org">info@vidyavaidya.org</a></p>
                      <p><a href="mailto:support@vidyavaidya.org">support@vidyavaidya.org</a></p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">📞</div>
                    <div>
                      <h3>Phone</h3>
                      <p><a href="tel:+911234567890">+91-1234-567-890</a></p>
                      <p>Monday - Friday, 9 AM - 6 PM IST</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">📍</div>
                    <div>
                      <h3>Headquarters</h3>
                      <p>New Delhi, India</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">⏰</div>
                    <div>
                      <h3>Working Hours</h3>
                      <p>Mon - Fri: 9:00 AM - 6:00 PM<br />Sat: 10:00 AM - 4:00 PM<br />Sun: Closed</p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="social-links">
                  <h3>Follow Us</h3>
                  <div className="social-icons">
                    <a href="#" className="social-icon">📱</a>
                    <a href="#" className="social-icon">👍</a>
                    <a href="#" className="social-icon">🐦</a>
                    <a href="#" className="social-icon">📺</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Offices */}
        <section className="offices-section">
          <div className="contact-container">
            <h2 className="section-title">Our Offices</h2>
            <div className="offices-grid">
              {offices.map((office, idx) => (
                <div key={idx} className="office-card">
                  <h3>{office.city}</h3>
                  <p className="office-address">{office.address}</p>
                  <p className="office-phone"><strong>Phone:</strong> {office.phone}</p>
                  <p className="office-email"><strong>Email:</strong> <a href={`mailto:${office.email}`}>{office.email}</a></p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="contact-container">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>How can I donate?</h3>
                <p>You can donate through our website using the 'Donate Now' button or contact our support team for wire transfer and other payment methods.</p>
              </div>
              <div className="faq-item">
                <h3>How will my donation be used?</h3>
                <p>100% of donations go towards education, healthcare, and community welfare programs. We maintain full transparency in fund utilization.</p>
              </div>
              <div className="faq-item">
                <h3>Can I volunteer?</h3>
                <p>Yes! We welcome volunteers. Please fill out the Volunteer Form or contact our office to learn about opportunities.</p>
              </div>
              <div className="faq-item">
                <h3>How do I become a partner?</h3>
                <p>We actively seek partnerships with organizations aligned with our mission. Please contact our partnerships team to discuss collaboration opportunities.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
