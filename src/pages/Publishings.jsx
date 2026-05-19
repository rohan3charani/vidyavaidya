import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Loader2 } from "lucide-react";
import api from "../services/api";
import "./Pages.css";

const staticReports = [
  { year: "2023–2024", title: "VidyaVaidya Annual Impact Report", type: "PDF Document • 3.2 MB", icon: "📄", url: "#" },
  { year: "2023", title: "Healthcare Accessibility in Rural India: A Study", type: "Research Paper • 1.8 MB", icon: "📊", url: "#" },
  { year: "2022–2023", title: "VidyaVaidya Annual Impact Report", type: "PDF Document • 2.5 MB", icon: "📄", url: "#" },
  { year: "2021", title: "Post-Pandemic Educational Deficits in Public Schools", type: "Case Study • 1.1 MB", icon: "📚", url: "#" }
];

export default function Publishings() {
  const [dynamicReports, setDynamicReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublishings = async () => {
      try {
        const data = await api.stories.list();
        const pubs = (data || []).filter(
          (s) => s.isPublished && s.type === "publishing"
        );
        const mapped = pubs.map((p) => {
          let yearVal = p.sourceByline;
          if (!yearVal && p.publishedAt) {
            yearVal = new Date(p.publishedAt).getFullYear().toString();
          }
          return {
            title: p.title,
            year: yearVal || "2024",
            type: p.excerpt || "PDF Document • 2.4 MB",
            icon: "📄",
            url: p.externalUrl || p.coverImageUrl || "#"
          };
        });
        setDynamicReports(mapped);
      } catch (err) {
        console.error("Failed to load publishings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublishings();
  }, []);

  const reports = dynamicReports.length > 0 ? dynamicReports : staticReports;

  const handleDownload = (url) => {
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      alert("This document is currently offline. Please check back later.");
    }
  };

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
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
            </div>
          ) : (
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
                  <button 
                    className="pub-download-btn cursor-pointer"
                    onClick={() => handleDownload(doc.url)}
                  >
                    ⬇ Download
                  </button>
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
