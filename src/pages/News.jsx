import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Pages.css";

export default function News() {
  const articles = [
    {
      id: 1,
      date: "Oct 12, 2024",
      title: "VidyaVaidya Launches Mobile Clinic in Remote Districts",
      excerpt: "Our new mobile healthcare unit will serve 50+ villages ensuring timely medical support and diagnostics for communities lacking nearby hospital infrastructure."
    },
    {
      id: 2,
      date: "Sep 28, 2024",
      title: "Strategic Partnership with Global Health Care Announced",
      excerpt: "We are thrilled to announce an alliance that will fund fully-equipped libraries across our partnered schools and support critical surgeries for marginalized children."
    },
    {
      id: 3,
      date: "Sep 10, 2024",
      title: "Annual Education Drive Reaches a New Milestone",
      excerpt: "Thanks to our donors, we celebrated handing over our 5,000th educational kit at City Central Public School—marking a defining moment for VidyaVaidya."
    }
  ];

  return (
    <div className="page-wrapper">
      <Navbar />

      <section className="page-hero">
        <span className="page-hero-tag">Latest Updates</span>
        <h1>News & Announcements</h1>
        <p>Stay up to speed with our organizational developments and community-driven programs across India.</p>
      </section>

      <section className="page-section" style={{ background: "#f8fafc" }}>
        <div className="page-container--narrow">
          <div className="news-list">
            {articles.map(a => (
              <div key={a.id} className="news-card">
                <p className="news-date">{a.date}</p>
                <h2 className="news-card-title">{a.title}</h2>
                <p className="news-card-excerpt">{a.excerpt}</p>
                <button className="news-read-more">Read Full Story →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
