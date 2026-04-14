import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Pages.css";

export default function VideoGallery() {
  const videos = [
    { id: 1, title: "Impacting 10,000+ Lives in 2024", duration: "12:30", thumb: "https://images.unsplash.com/photo-1494883759339-0b042055a4ee?w=600&q=80" },
    { id: 2, title: "Our Medical Mission in Rural India", duration: "08:15", thumb: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&q=80" },
    { id: 3, title: "Voices of Hope: Beneficiary Stories", duration: "15:45", thumb: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80" },
    { id: 4, title: "Annual Volunteering Weekend Highlights", duration: "05:22", thumb: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80" }
  ];

  return (
    <div className="page-wrapper video-page-bg">
      <Navbar />

      <section className="page-hero" style={{ background: "transparent" }}>
        <span className="page-hero-tag">Events</span>
        <h1>Video Gallery</h1>
        <p>Experience our journey through these moving stories and documentary highlights.</p>
      </section>

      <section className="page-section">
        <div className="page-container">
          <div className="video-grid">
            {videos.map(vid => (
              <div key={vid.id} className="video-card">
                <img src={vid.thumb} alt={vid.title} />
                <div className="video-play-btn">▶</div>
                <div className="video-card-info">
                  <h3 className="video-card-title">{vid.title}</h3>
                  <p className="video-card-duration">Duration: {vid.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
