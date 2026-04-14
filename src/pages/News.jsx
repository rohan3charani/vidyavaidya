import { useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./News.css";

export default function News() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const news = [
    {
      id: 1,
      title: "1000+ Students Receive Scholarships",
      date: "April 10, 2026",
      category: "Education",
      image: "📚",
      excerpt: "We are proud to announce that this year we have distributed scholarships to over 1000 deserving students across India.",
      content: "In our latest initiative, we successfully distributed scholarships to 1000+ meritorious students from underprivileged backgrounds, enabling them to pursue their education without financial constraints.",
    },
    {
      id: 2,
      title: "Free Health Camp Reaches 5000 Beneficiaries",
      date: "April 5, 2026",
      category: "Healthcare",
      image: "⚕️",
      excerpt: "Our quarterly health camps reached 5000+ people with free medical consultations and health checkups across 10 cities.",
      content: "The free health camps organized by Vidya Vaidya Foundation successfully provided medical consultations to 5000+ beneficiaries, diagnosing and treating various health conditions.",
    },
    {
      id: 3,
      title: "Community Welfare Program Expands",
      date: "March 28, 2026",
      category: "Community",
      image: "🤝",
      excerpt: "We have expanded our community welfare programs to 25 new villages, providing food security and nutrition support.",
      content: "Our community welfare initiatives have now reached 25 additional villages, providing nutrition support, food security, and livelihood training to over 2000 families.",
    },
    {
      id: 4,
      title: "Partnership with Leading Hospitals",
      date: "March 20, 2026",
      category: "Partnership",
      image: "🏥",
      excerpt: "We have partnered with 8 leading hospitals to provide subsidized medical treatments for our beneficiaries.",
      content: "A strategic partnership with leading hospital chains ensures that our beneficiaries get access to quality healthcare at subsidized rates.",
    },
    {
      id: 5,
      title: "Digital Literacy Program Launched",
      date: "March 15, 2026",
      category: "Education",
      image: "💻",
      excerpt: "Introducing our new digital literacy program to bridge the technology gap in rural communities.",
      content: "Our new digital literacy initiative aims to equip students in rural areas with essential computer skills and internet knowledge.",
    },
    {
      id: 6,
      title: "Impact Story: From Struggle to Success",
      date: "March 10, 2026",
      category: "Stories",
      image: "⭐",
      excerpt: "Meet Priya, whose life changed through our education and healthcare programs. From a struggling household to becoming a topper.",
      content: "This inspiring story showcases how our integrated approach to education and healthcare has transformed lives in rural communities.",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="news-page">
        {/* Hero Section */}
        <section className="news-hero">
          <div className="news-hero-content">
            <h1>Stories & News</h1>
            <p className="news-subtitle">Inspiring stories of change and impact</p>
          </div>
        </section>

        {/* Featured News */}
        <section className="featured-news">
          <div className="news-container">
            <h2 className="section-title">Latest Updates</h2>
            <div className="featured-card">
              <div className="featured-image">{news[0].image}</div>
              <div className="featured-content">
                <span className="featured-category">{news[0].category}</span>
                <h2>{news[0].title}</h2>
                <p className="featured-date">{news[0].date}</p>
                <p className="featured-excerpt">{news[0].excerpt}</p>
                <button className="read-more-btn">Read Full Story →</button>
              </div>
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="news-grid-section">
          <div className="news-container">
            <div className="news-grid">
              {news.slice(1).map((article) => (
                <div key={article.id} className="news-card">
                  <div className="news-image">{article.image}</div>
                  <div className="news-category">{article.category}</div>
                  <h3>{article.title}</h3>
                  <p className="news-date">{article.date}</p>
                  <p className="news-excerpt">{article.excerpt}</p>
                  <button className="news-btn">Read More →</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Statistics */}
        <section className="impact-stats">
          <div className="news-container">
            <h2 className="section-title">Our Impact at a Glance</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>5000+</h3>
                <p>Students Supported</p>
              </div>
              <div className="stat-card">
                <h3>50000+</h3>
                <p>Lives Touched</p>
              </div>
              <div className="stat-card">
                <h3>₹10 Cr+</h3>
                <p>Community Impact</p>
              </div>
              <div className="stat-card">
                <h3>100+</h3>
                <p>Programs Running</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="news-categories">
          <div className="news-container">
            <h2 className="section-title">Browse by Category</h2>
            <div className="categories">
              <button className="category-tag active">All</button>
              <button className="category-tag">Education</button>
              <button className="category-tag">Healthcare</button>
              <button className="category-tag">Community</button>
              <button className="category-tag">Stories</button>
              <button className="category-tag">Partnerships</button>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="newsletter">
          <div className="news-container">
            <div className="newsletter-box">
              <h2>Get Updates on Our Work</h2>
              <p>Subscribe to receive stories and updates about our programs and impact</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Enter your email" required />
                <button type="submit" className="newsletter-btn">Subscribe</button>
              </form>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
