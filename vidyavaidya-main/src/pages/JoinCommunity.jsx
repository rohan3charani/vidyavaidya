import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Heart, Building2, Hospital } from "lucide-react";
import "./JoinCommunity.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const COMMUNITY_CARDS = [
  {
    id: "volunteer",
    title: "Become a Volunteer",
    description: "Dedicate your time and skills to help children receive better education and healthcare.",
    icon: <Users size={32} />,
    path: "/join/volunteer"
  },
  {
    id: "donor",
    title: "Become a Donor",
    description: "Your contributions can provide life-changing resources for underprivileged communities.",
    icon: <Heart size={32} />,
    path: "/join/donor"
  },
  {
    id: "corporate",
    title: "Corporate Partnerships",
    description: "Connect your organization with our mission to create a sustainable social impact.",
    icon: <Building2 size={32} />,
    path: "/join/corporate"
  },
  {
    id: "hospital",
    title: "Hospitals Collaboration",
    description: "Join our healthcare network to provide medical support and expertise to children.",
    icon: <Hospital size={32} />,
    path: "/join/hospital"
  }
];

export default function JoinCommunity() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="join-community-wrapper">
      <Navbar />
      <main className="join-community-page">
        <header className="community-header">
          <h1>Join Our Community</h1>
          <p>
            Be a part of VidyaVaidya’s mission to create impact through 
            education and healthcare. Every contribution matters.
          </p>
        </header>

        <section className="cards-grid">
          {COMMUNITY_CARDS.map((card) => (
            <div 
              key={card.id} 
              className="community-card"
              onClick={() => navigate(card.path)}
              role="button"
              tabIndex={0}
            >
              <div className="card-icon-wrapper">
                {card.icon}
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <button className="apply-btn">Join Now</button>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
