import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Loader2 } from "lucide-react";
import api from "../services/api";
import "./Pages.css";

const staticVideos = [
  { id: 1, title: "Impacting 10,000+ Lives in 2024", duration: "12:30", thumb: "https://images.unsplash.com/photo-1494883759339-0b042055a4ee?w=600&q=80", url: "https://www.youtube.com" },
  { id: 2, title: "Our Medical Mission in Rural India", duration: "08:15", thumb: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&q=80", url: "https://www.youtube.com" },
  { id: 3, title: "Voices of Hope: Beneficiary Stories", duration: "15:45", thumb: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80", url: "https://www.youtube.com" },
  { id: 4, title: "Annual Volunteering Weekend Highlights", duration: "05:22", thumb: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80", url: "https://www.youtube.com" }
];

export default function VideoGallery() {
  const [dynamicVideos, setDynamicVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.events.list({ limit: 1000 });
        const data = res?.events || (Array.isArray(res) ? res : []);
        const vids = data.filter(
          (e) => e.eventType === "video" || !!e.videoUrl
        );
        const mapped = vids.map((v) => ({
          id: v.id || v.eventId,
          title: v.title,
          duration: v.videoDuration || "05:00",
          thumb: v.thumbnailUrl || v.videoThumbnailUrl || "https://images.unsplash.com/photo-1494883759339-0b042055a4ee?w=600&q=80",
          url: v.videoUrl
        }));
        setDynamicVideos(mapped);
      } catch (err) {
        console.error("Failed to load gallery videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const videos = [...dynamicVideos, ...staticVideos];

  const handleWatch = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="page-wrapper video-page-bg">
      <Navbar />

      <section className="page-hero">
        <span className="page-hero-tag">Events</span>
        <h1>Video Gallery</h1>
        <p>Experience our journey through these moving stories and documentary highlights.</p>
      </section>

      <section className="page-section">
        <div className="page-container">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
            </div>
          ) : (
            <div className="video-grid">
              {videos.map(vid => (
                <div 
                  key={vid.id} 
                  className="video-card cursor-pointer" 
                  onClick={() => handleWatch(vid.url)}
                  title="Watch Video"
                >
                  <img src={vid.thumb} alt={vid.title} />
                  <div className="video-play-btn">▶</div>
                  <div className="video-card-info">
                    <h3 className="video-card-title">{vid.title}</h3>
                    <p className="video-card-duration">Duration: {vid.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
