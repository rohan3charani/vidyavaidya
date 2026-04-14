import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Pages.css";

export default function Publishings() {
  const reports = [
    { year: "2023–2024", title: "VidyaVaidya Annual Impact Report", type: "PDF Document • 3.2 MB", icon: "📄" },
    { year: "2023", title: "Healthcare Accessibility in Rural India: A Study", type: "Research Paper • 1.8 MB", icon: "📊" },
    { year: "2022–2023", title: "VidyaVaidya Annual Impact Report", type: "PDF Document • 2.5 MB", icon: "📄" },
    { year: "2021", title: "Post-Pandemic Educational Deficits in Public Schools", type: "Case Study • 1.1 MB", icon: "📚" }
  ];

  return (
    <div className="page-wrapper">
      <Navbar />

      <section className="page-hero">
        <span className="page-hero-tag">Resources</span>
        <h1>Publishings & Reports</h1>
        <p>Explore our publicly available annual reports, research papers, and case studies on social reform and community impact.</p>
      </section>

      <section className="page-section">
        <div className="page-container--narrow">
          <div className="pub-list">
            {reports.map((doc, i) => (
              <div key={i} className="pub-row">
                <span className="pub-icon">{doc.icon}</span>
                <div className="pub-info">
                  <h3 className="pub-title">{doc.title}</h3>
                  <div className="pub-meta">
                    <span className="pub-year">{doc.year}</span>
                    <span>·</span>
                    <span>{doc.type}</span>
                  </div>
                </div>
                <button className="pub-download-btn">⬇ Download</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
