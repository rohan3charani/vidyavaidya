import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import vidyaLogo from "../assets/Vidya1.png";
import {
  CalendarDays,
  CircleUserRound,
  IndianRupee,
  Mail,
  Phone,
  RefreshCw,
  Search,
  TrendingUp,
  LogOut,
  MapPin,
  Building2,
  User,
  ArrowLeft,
  Check
} from "lucide-react";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  // Load profile details from state, initialized from a persistent store or premium defaults
  const [profile, setProfile] = useState(() => {
    const cached = localStorage.getItem("vv_user_profile");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return {
      fullName: "VIDYA VAIDYA",
      email: "vidyavaidyanlr@gmail.com",
      mobile: "+91 1234567890",
      isAlumni: true,
      alumniId: "VV-2018-042",
      gradYear: "2018",
      address: "123, Vidya Vaidya Street, Educational Sector",
      city: "Nellore",
      state: "Andhra Pradesh",
      country: "India",
      pincode: "524001"
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState({ ...profile });
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const [currentView, setCurrentView] = useState("dashboard"); // "dashboard" | "profile"
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All types");
  const [type, setType] = useState("All types");
  const [status, setStatus] = useState("All status");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Click outside listener to securely close dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (showDropdown && !e.target.closest(".dash-profile-dropdown-wrapper")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [showDropdown]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("vv_auth");
    navigate("/");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // When click on refresh button it should refresh the page
    setTimeout(() => {
      setIsRefreshing(false);
      window.location.reload();
    }, 1000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile(editProfile);
    localStorage.setItem("vv_user_profile", JSON.stringify(editProfile));
    setIsEditing(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const initial = profile.fullName.charAt(0);

  return (
    <main className="dashboard-root">
      {/* 1. Global Navigation Bar */}
      <nav className="dash-header-navbar">
        <div className="dash-brand" onClick={() => setCurrentView("dashboard")}>
          <img src={vidyaLogo} alt="VidyaVaidya Logo" className="dash-brand-logo-img" />
          <h1 className="dash-brand-text">VidyaVaidya</h1>
        </div>

        <div className="dash-nav-controls">
          {/* Refresh Button */}
          <button
            type="button"
            className={`dash-control-btn dash-refresh-btn ${isRefreshing ? "refreshing" : ""}`}
            onClick={handleRefresh}
            title="Refresh Page"
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? "spin-icon" : ""} />
          </button>

          {/* Profile Trigger + Dropdown */}
          <div className="dash-profile-dropdown-wrapper">
            <button
              type="button"
              className="dash-profile-trigger"
              onClick={() => setShowDropdown(!showDropdown)}
              title="User Menu"
            >
              <div className="dash-avatar-circle">
                {initial}
              </div>
            </button>

            {showDropdown && (
              <div className="dash-dropdown-menu">
                <button
                  type="button"
                  className={`dash-dropdown-item ${currentView === "profile" ? "active" : ""}`}
                  onClick={() => {
                    setCurrentView("profile");
                    setShowDropdown(false);
                  }}
                >
                  <CircleUserRound size={16} />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  className={`dash-dropdown-item ${currentView === "dashboard" ? "active" : ""}`}
                  onClick={() => {
                    setCurrentView("dashboard");
                    setShowDropdown(false);
                  }}
                >
                  <TrendingUp size={16} />
                  <span>Dashboard</span>
                </button>

                <div className="dash-dropdown-divider"></div>

                <button
                  type="button"
                  className="dash-dropdown-item logout-item"
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={16} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Main Body Content (Conditional View) */}
      <section className="dashboard-container">
        {currentView === "dashboard" ? (
          /* ================= DASHBOARD VIEW ================= */
          <>
            <article className="profile-card">
              <div className="avatar">{initial}</div>
              <div className="profile-main">
                <span className="greeting">{greeting}</span>
                <h1>{profile.fullName}</h1>
                <div className="contact-line">
                  <span>
                    <Mail size={14} /> {profile.email}
                  </span>
                  <span>
                    <Phone size={14} /> {profile.mobile}
                  </span>
                </div>
              </div>
            </article>

            <section className="stats-grid">
              <article className="stat-card">
                <div className="stat-top">
                  <p>TOTAL DONATED</p>
                  <span className="stat-icon">
                    <IndianRupee size={15} />
                  </span>
                </div>
                <h2>₹0</h2>
                <div className="stat-bottom">
                  <span>0 Contributions</span>
                  <strong>0%</strong>
                </div>
              </article>

              <article className="stat-card">
                <div className="stat-top">
                  <p>FAILED</p>
                  <span className="stat-icon">✕</span>
                </div>
                <h2>0</h2>
                <div className="stat-bottom">
                  <span>of 0 Total</span>
                  <strong>0%</strong>
                </div>
              </article>

              <article className="stat-card">
                <div className="stat-top">
                  <p>RECURRING</p>
                  <span className="stat-icon">
                    <RefreshCw size={14} />
                  </span>
                </div>
                <h2>0</h2>
                <div className="stat-bottom">
                  <span>Monthly</span>
                  <strong>0%</strong>
                </div>
              </article>

              <article className="stat-card">
                <div className="stat-top">
                  <p>ONE-TIME</p>
                  <span className="stat-icon">⚡</span>
                </div>
                <h2>0</h2>
                <div className="stat-bottom">
                  <span>One-time</span>
                  <strong>0%</strong>
                </div>
              </article>
            </section>

            <section className="panel transactions-panel">
              <div className="panel-head">
                <h3>All Transactions</h3>
                <span className="count-pill">0</span>
              </div>
              <div className="filters-row">
                <div className="search-wrap">
                  <Search size={14} />
                  <input
                    type="text"
                    placeholder="Search ID, category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>All types</option>
                  <option>Education</option>
                  <option>Healthcare</option>
                </select>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option>All types</option>
                  <option>Recurring</option>
                  <option>One-time</option>
                </select>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option>All status</option>
                  <option>Successful</option>
                  <option>Failed</option>
                  <option>Pending</option>
                </select>
              </div>

              <div className="table-wrap">
                <div className="table-header">
                  <span>Date</span>
                  <span>Transaction ID</span>
                  <span>Amount</span>
                  <span>Category</span>
                  <span>Type</span>
                  <span>Status</span>
                </div>
                <div className="table-empty">
                  <CalendarDays size={18} />
                  <p>No transactions found</p>
                </div>
              </div>
            </section>

            <section className="panel month-panel">
              <div className="panel-heading-row">
                <div>
                  <h3>Month Wise Contributions</h3>
                  <p>Total amount donated per month</p>
                </div>
                <span className="panel-icon">
                  <IndianRupee size={16} />
                </span>
              </div>
              <div className="empty-center">No data yet</div>
            </section>

            <section className="bottom-grid">
              <article className="panel">
                <div className="panel-heading-row">
                  <div>
                    <h3>Payment Frequency</h3>
                    <p>Payments per month - amount shown above each dot</p>
                  </div>
                  <span className="panel-icon">
                    <TrendingUp size={15} />
                  </span>
                </div>
                <div className="empty-center">No trend data yet</div>
              </article>

              <article className="panel">
                <div className="panel-heading-row">
                  <div>
                    <h3>Payment Health</h3>
                    <p>Success vs failed breakdown</p>
                  </div>
                </div>
                <div className="health-list">
                  <div>
                    <span className="dot success" />
                    Successful
                    <strong>0</strong>
                  </div>
                  <div>
                    <span className="dot failed" />
                    Failed
                    <strong>0</strong>
                  </div>
                  <div>
                    <span className="dot pending" />
                    Pending
                    <strong>0</strong>
                  </div>
                </div>
              </article>
            </section>
          </>
        ) : (
          /* ================= PROFILE VIEW ================= */
          <div className="profile-page-view">
            <header className="profile-page-header-row">
              <button 
                type="button" 
                className="profile-back-btn" 
                onClick={() => {
                  setCurrentView("dashboard");
                  setIsEditing(false);
                }}
              >
                <ArrowLeft size={16} /> Back to Dashboard
              </button>
              <h2>User Profile Settings</h2>
            </header>

            {showSaveSuccess && (
              <div className="profile-save-banner">
                <Check size={16} /> Profile updated successfully!
              </div>
            )}

            <div className="profile-settings-layout">
              {/* Left Column: summary */}
              <div className="profile-summary-side">
                <div className="profile-summary-avatar-card">
                  <div className="profile-summary-avatar">{initial}</div>
                  <h3>{profile.fullName}</h3>
                  <p className="profile-summary-email">{profile.email}</p>
                  <div className="profile-summary-badges">
                    <span className="profile-badge-pill donor-badge">Active Donor</span>
                    {profile.isAlumni && (
                      <span className="profile-badge-pill alumni-badge">Alumni Partner</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="profile-details-side">
                <form onSubmit={handleSaveProfile} className="profile-form-box">
                  {/* Section 1: Personal Details */}
                  <div className="profile-form-section">
                    <h3 className="section-title">
                      <User size={18} /> Personal Details
                    </h3>
                    <div className="profile-form-grid">
                      <div className="profile-field-group">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          value={isEditing ? editProfile.fullName : profile.fullName}
                          disabled={!isEditing}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, fullName: e.target.value }))}
                          required
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="profile-field-group">
                        <label>Email Address *</label>
                        <input
                          type="email"
                          value={isEditing ? editProfile.email : profile.email}
                          disabled={!isEditing}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, email: e.target.value }))}
                          required
                          placeholder="you@example.com"
                        />
                      </div>
                      <div className="profile-field-group">
                        <label>Mobile Number *</label>
                        <input
                          type="text"
                          value={isEditing ? editProfile.mobile : profile.mobile}
                          disabled={!isEditing}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, mobile: e.target.value }))}
                          required
                          placeholder="10-digit mobile"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Alumni Affiliation */}
                  <div className="profile-form-section">
                    <h3 className="section-title">
                      <Building2 size={18} /> Alumni Affiliation
                    </h3>
                    
                    <div className="profile-alumni-toggle-container">
                      <label className="profile-checkbox-label">
                        <input
                          type="checkbox"
                          className="profile-checkbox-input"
                          checked={isEditing ? editProfile.isAlumni : profile.isAlumni}
                          disabled={!isEditing}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setEditProfile(prev => ({ ...prev, isAlumni: checked }));
                          }}
                        />
                        <span className="profile-checkbox-text">Are you a VidyaVaidya Alumni?</span>
                      </label>
                    </div>

                    {(isEditing ? editProfile.isAlumni : profile.isAlumni) && (
                      <div className="profile-form-grid" style={{ marginTop: "20px" }}>
                        <div className="profile-field-group">
                          <label>Alumni ID *</label>
                          <input
                            type="text"
                            value={isEditing ? editProfile.alumniId : profile.alumniId}
                            disabled={!isEditing}
                            onChange={(e) => setEditProfile(prev => ({ ...prev, alumniId: e.target.value }))}
                            required
                            placeholder="e.g. VV-2018-042"
                          />
                        </div>
                        <div className="profile-field-group">
                          <label>Year of Graduation *</label>
                          <input
                            type="text"
                            value={isEditing ? editProfile.gradYear : profile.gradYear}
                            disabled={!isEditing}
                            onChange={(e) => setEditProfile(prev => ({ ...prev, gradYear: e.target.value }))}
                            required
                            placeholder="e.g. 2018"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 3: Address Details */}
                  <div className="profile-form-section">
                    <h3 className="section-title">
                      <MapPin size={18} /> Address Details
                    </h3>
                    <div className="profile-form-grid">
                      <div className="profile-field-group full-width">
                        <label>Address (No, Street, Area) *</label>
                        <input
                          type="text"
                          value={isEditing ? editProfile.address : profile.address}
                          disabled={!isEditing}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, address: e.target.value }))}
                          required
                          placeholder="House No, Street Name, Area"
                        />
                      </div>
                      <div className="profile-field-group">
                        <label>City / District *</label>
                        <input
                          type="text"
                          value={isEditing ? editProfile.city : profile.city}
                          disabled={!isEditing}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, city: e.target.value }))}
                          required
                          placeholder="City Name"
                        />
                      </div>
                      <div className="profile-field-group">
                        <label>State *</label>
                        <input
                          type="text"
                          value={isEditing ? editProfile.state : profile.state}
                          disabled={!isEditing}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, state: e.target.value }))}
                          required
                          placeholder="Select State"
                        />
                      </div>
                      <div className="profile-field-group">
                        <label>Country *</label>
                        <input
                          type="text"
                          value={isEditing ? editProfile.country : profile.country}
                          disabled={!isEditing}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, country: e.target.value }))}
                          required
                          placeholder="Country"
                        />
                      </div>
                      <div className="profile-field-group">
                        <label>Pincode *</label>
                        <input
                          type="text"
                          value={isEditing ? editProfile.pincode : profile.pincode}
                          disabled={!isEditing}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, pincode: e.target.value }))}
                          required
                          placeholder="6-digit pincode"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="profile-form-actions">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          className="profile-btn-secondary"
                          onClick={() => {
                            setIsEditing(false);
                            setEditProfile({ ...profile });
                          }}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="profile-btn-primary">
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="profile-btn-primary"
                        onClick={() => {
                          setIsEditing(true);
                          setEditProfile({ ...profile });
                        }}
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
