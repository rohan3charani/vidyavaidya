import { useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Events.css";

export default function Events() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const upcomingEvents = [
    {
      id: 1,
      title: "Health Camp at Delhi",
      date: "April 25, 2026",
      location: "Delhi",
      description: "Free medical checkups and health consultations",
      category: "Healthcare",
    },
    {
      id: 2,
      title: "Scholarship Distribution Ceremony",
      date: "May 5, 2026",
      location: "Mumbai",
      description: "Annual scholarship distribution for meritorious students",
      category: "Education",
    },
    {
      id: 3,
      title: "Community Awareness Drive",
      date: "May 15, 2026",
      location: "Bangalore",
      description: "Environmental awareness and community participation program",
      category: "Community",
    },
  ];

  const pastEvents = [
    {
      id: 1,
      title: "World Health Day Celebration",
      date: "April 7, 2026",
      location: "Multiple Cities",
      description: "Reached 1000+ beneficiaries across 5 cities",
    },
    {
      id: 2,
      title: "Education Day Seminar",
      date: "March 20, 2026",
      location: "Delhi",
      description: "Career guidance for 500 students",
    },
    {
      id: 3,
      title: "Annual Fundraiser Gala",
      date: "March 10, 2026",
      location: "Mumbai",
      description: "Raised ₹50 Lakhs for education programs",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="events-page">
        {/* Hero Section */}
        <section className="events-hero">
          <div className="events-hero-content">
            <h1>Our Events</h1>
            <p className="events-subtitle">Join us in making a difference</p>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="upcoming-events">
          <div className="events-container">
            <h2 className="section-title">Upcoming Events</h2>
            <div className="events-grid">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="event-card upcoming">
                  <div className="event-header">
                    <span className="event-category">{event.category}</span>
                    <span className="event-status">Upcoming</span>
                  </div>
                  <h3>{event.title}</h3>
                  <div className="event-details">
                    <p className="event-date">📅 {event.date}</p>
                    <p className="event-location">📍 {event.location}</p>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <button className="event-btn">Register Now →</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Past Events */}
        <section className="past-events">
          <div className="events-container">
            <h2 className="section-title">Past Events</h2>
            <div className="timeline">
              {pastEvents.map((event, idx) => (
                <div key={event.id} className="timeline-item">
                  <div className="timeline-marker" />
                  <div className="timeline-content">
                    <h3>{event.title}</h3>
                    <p className="timeline-date">{event.date}</p>
                    <p className="timeline-location">{event.location}</p>
                    <p className="timeline-description">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Event Categories */}
        <section className="event-categories">
          <div className="events-container">
            <h2 className="section-title">Types of Events We Organize</h2>
            <div className="categories-grid">
              <div className="category">
                <div className="category-icon">🏥</div>
                <h3>Health Camps</h3>
                <p>Free medical checkups and health awareness programs</p>
              </div>
              <div className="category">
                <div className="category-icon">📚</div>
                <h3>Educational Programs</h3>
                <p>Scholarships, seminars, and skill development workshops</p>
              </div>
              <div className="category">
                <div className="category-icon">🤝</div>
                <h3>Community Events</h3>
                <p>Awareness drives and community welfare initiatives</p>
              </div>
              <div className="category">
                <div className="category-icon">💰</div>
                <h3>Fundraisers</h3>
                <p>Events to support our ongoing programs and initiatives</p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="newsletter-cta">
          <div className="events-container">
            <div className="cta-box">
              <h2>Stay Updated with Our Events</h2>
              <p>Subscribe to our newsletter to get updates about upcoming events and opportunities to participate</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Enter your email" required />
                <button type="submit" className="subscribe-btn">Subscribe</button>
              </form>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
