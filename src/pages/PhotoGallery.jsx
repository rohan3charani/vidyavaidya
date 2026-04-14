import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Pages.css";

export default function PhotoGallery() {
  const images = [
    { id: 1, url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80", title: "Free Health Checkup Camp 2024" },
    { id: 2, url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80", title: "School Kit Distribution" },
    { id: 3, url: "https://images.unsplash.com/photo-1593113563332-e147ce897c48?w=600&q=80", title: "Women Empowerment Workshop" },
    { id: 4, url: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&q=80", title: "Community Food Drive" },
    { id: 5, url: "https://images.unsplash.com/photo-1610484732646-0bbce6eaccc8?w=600&q=80", title: "Rural Medical Outreach" },
    { id: 6, url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80", title: "Digital Literacy Program" }
  ];

  return (
    <div className="page-wrapper">
      <Navbar />

      <section className="page-hero">
        <span className="page-hero-tag">Events</span>
        <h1>Photo Gallery</h1>
        <p>A glimpse into the smiles we've shared and the lives we've touched across India.</p>
      </section>

      <section className="page-section" style={{ background: "#f8fafc" }}>
        <div className="page-container">
          <div className="photo-grid">
            {images.map(img => (
              <div key={img.id} className="photo-card">
                <img src={img.url} alt={img.title} />
                <div className="photo-card-label">{img.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
