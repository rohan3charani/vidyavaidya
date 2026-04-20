import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/Vidya1.png";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [eventsDropdown, setEventsDropdown] = useState(false);
  const [storiesDropdown, setStoriesDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Our Mission", path: "/mission" },
    { title: "Partners", path: "/partners" },
  ];

  return (
    <header className="vv-navbar">
      <div className="vv-navbar-inner">
        {/* Brand */}
        <NavLink to="/" className="vv-brand">
          <img src={logo} alt="VidyaVaidya Logo" className="vv-logo" style={{width: "70px", height: "70px"}}/>
          <span className="vv-brand-text" style={{color: "#000000ff",fontWeight: "bold",fontFamily: "Playfair Display",   fontSize: "1.5rem"}}>VidyaVaidya</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="vv-nav-group">
          {navLinks.map((link) => (
            <NavLink
              key={link.title}
              to={link.path}
              className={({ isActive }) => (isActive ? "vv-nav-link active" : "vv-nav-link")}
            >
              {link.title}
            </NavLink>
          ))}

          {/* Events Dropdown */}
          <div
            className="vv-dropdown-container"
            onMouseEnter={() => setEventsDropdown(true)}
            onMouseLeave={() => setEventsDropdown(false)}
          >
            <button className="vv-nav-link">
              Events <span>▾</span>
            </button>
            {eventsDropdown && (
              <div className="vv-dropdown-menu">
                <NavLink to="/PhotoGallery" className="vv-dropdown-item">Photo Gallery</NavLink>
                <NavLink to="/VideoGallery" className="vv-dropdown-item">Video Gallery</NavLink>
              </div>
            )}
          </div>

          {/* Stories Dropdown */}
          <div
            className="vv-dropdown-container"
            onMouseEnter={() => setStoriesDropdown(true)}
            onMouseLeave={() => setStoriesDropdown(false)}
          >
            <button className="vv-nav-link">
              Stories & News <span>▾</span>
            </button>
            {storiesDropdown && (
              <div className="vv-dropdown-menu">
                <NavLink to="/news" className="vv-dropdown-item">News</NavLink>
                <NavLink to="/publishings" className="vv-dropdown-item">Publishings</NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? "vv-nav-link active" : "vv-nav-link")}
          >
            Contact
          </NavLink>

          <button
            onClick={() => {
              if (localStorage.getItem("vv_auth")) {
                navigate("/join-community");
              } else {
                localStorage.setItem("vv_redirect", "/join-community");
                navigate("/auth");
              }
            }}
            className={location.pathname === "/join-community" ? "vv-nav-link vv-join-community active" : "vv-nav-link vv-join-community"}>
            Be Part of Us
          </button>
        </nav>

        {/* Actions */}
        <div className="vv-actions">
          <button className="vv-search-btn" aria-label="Search">
            <Search size={18} />
          </button>

          <button
            onClick={() => navigate("/donate")}
            className="vv-btn vv-btn-donate">
            DONATE NOW ✋
          </button>

          <button
            onClick={() => navigate("/auth")}
            className="vv-btn vv-btn-login desktop-only"
          >
            Login
          </button>

          {/* Mobile Toggle */}
          <button className="vv-mobile-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="vv-mobile-menu">
          {navLinks.map((link) => (
            <NavLink
              key={link.title}
              to={link.path}
              className="vv-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.title}
            </NavLink>
          ))}
          <NavLink to="/events" className="vv-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Events</NavLink>
          <NavLink to="/news" className="vv-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Stories & News</NavLink>
          <NavLink to="/contact" className="vv-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</NavLink>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate("/join-community");
            }}
            className="vv-nav-link vv-join-community"
          >
            Be Part of Us
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate("/auth");
            }}
            className="vv-btn vv-btn-login"
          >
            Login
          </button>
        </div>
      )}
    </header>
  );
}

