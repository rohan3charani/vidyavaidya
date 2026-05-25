// CHANGED: R1, R13
// R1, R13 — Added outside click/tap handler to auto-close mobile menu and fixed mobile menu links to point to active gallery routes instead of non-existent /events route.
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/Vidya1.png";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [eventsDropdown, setEventsDropdown] = useState(false);
  const [storiesDropdown, setStoriesDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Our Mission", path: "/mission" },
    { title: "Partners", path: "/partners" },
  ];

  return (
    <header className="vv-navbar" ref={navbarRef}>
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
            <button className={`vv-nav-link ${location.pathname === '/PhotoGallery' || location.pathname === '/VideoGallery' ? 'active' : ''}`}>
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
            <button className={`vv-nav-link ${location.pathname === '/news' ? 'active' : ''}`}>
              Stories <span>▾</span>
            </button>
            {storiesDropdown && (
              <div className="vv-dropdown-menu">
                <NavLink to="/news" className="vv-dropdown-item">News</NavLink>
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
              navigate("/join-community");
            }}
            className={location.pathname === "/join-community" ? "vv-nav-link vv-join-community active" : "vv-nav-link vv-join-community"}>
            Be A Part of Us
          </button>
        </nav>

        {/* Actions */}
        <div className="vv-actions">

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
          <button className="vv-mobile-toggle" onClick={toggleMobileMenu} aria-label="Toggle navigation menu">
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
          <NavLink to="/PhotoGallery" className="vv-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Photo Gallery</NavLink>
          <NavLink to="/VideoGallery" className="vv-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Video Gallery</NavLink>
          <NavLink to="/news" className="vv-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Stories</NavLink>
          <NavLink to="/contact" className="vv-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</NavLink>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate("/join-community");
            }}
            className="vv-nav-link vv-join-community"
          >
            Be a Part of Us
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


