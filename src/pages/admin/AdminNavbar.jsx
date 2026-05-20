import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu, X, Bell, User, LogOut, Home, ChevronRight,
  CheckCheck, Clock, AlertCircle, Info, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ══════════════════════════════════════════
   BREADCRUMB — dynamic based on active module
══════════════════════════════════════════ */
const MODULE_META = {
  overview:        { parent: "Dashboard", label: "Overview" },
  donations:       { parent: "Dashboard", label: "All Donations" },
  users:           { parent: "Dashboard", label: "User Logins" },
  "user-donations":{ parent: "Dashboard", label: "User Donations" },
  "foreign-donors":{ parent: "Dashboard", label: "Foreign Donors" },
  analytics:       { parent: "Dashboard", label: "Analytics" },
  partners:        { parent: "Dashboard", label: "Partners" },
  stories:         { parent: "Dashboard", label: "Stories" },
  events:          { parent: "Dashboard", label: "Events" },
  testimonials:    { parent: "Dashboard", label: "Testimonials" },
  profile:         { parent: "Account",   label: "My Profile" },
};

function Breadcrumb({ activeSection }) {
  const meta = MODULE_META[activeSection] || { parent: "Dashboard", label: activeSection };
  return (
    <motion.div
      key={activeSection}
      className="adn-breadcrumb-v2"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22 }}
    >
      <Home size={13} className="adn-bc-home" />
      <ChevronRight size={12} className="adn-bc-sep" />
      <span className="adn-bc-parent">{meta.parent}</span>
      <ChevronRight size={12} className="adn-bc-sep" />
      <span className="adn-bc-current">{meta.label}</span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   NOTIFICATION SYSTEM
══════════════════════════════════════════ */
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "info",
    title: "New Donation Received",
    desc: "A donation of ₹5,000 was received from Ramesh Kumar.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    type: "alert",
    title: "Payment Failed",
    desc: "A payment attempt by Priya Sharma failed. Check details.",
    time: "18 min ago",
    read: false,
  },
  {
    id: 3,
    type: "success",
    title: "Community Application Approved",
    desc: "Volunteer application by Dr. Anil Reddy has been approved.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: 4,
    type: "info",
    title: "New User Registered",
    desc: "A new user Suresh Babu completed registration.",
    time: "3 hr ago",
    read: true,
  },
];

const NOTIF_ICONS = {
  info:    { icon: Info,         color: "#3b82f6" },
  alert:   { icon: AlertCircle,  color: "#e74c3c" },
  success: { icon: CheckCheck,   color: "#1abc9c" },
};

function NotificationPanel({ notifications, onMarkRead, onMarkAllRead, onClear }) {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <motion.div
      className="adn-notif-panel"
      initial={{ opacity: 0, y: -10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {/* Panel Header */}
      <div className="adn-notif-header">
        <div className="adn-notif-title">
          <Bell size={15} />
          Notifications
          {unread > 0 && <span className="adn-notif-count">{unread}</span>}
        </div>
        {unread > 0 && (
          <button className="adn-notif-mark-all" onClick={onMarkAllRead}>
            <CheckCheck size={13} /> Mark all read
          </button>
        )}
      </div>

      {/* Scrollable List */}
      <div className="adn-notif-list">
        {notifications.length === 0 ? (
          <div className="adn-notif-empty">
            <Bell size={32} className="adn-notif-empty-icon" />
            <p>You're all caught up!</p>
            <span>No new notifications.</span>
          </div>
        ) : (
          notifications.map((n) => {
            const { icon: Icon, color } = NOTIF_ICONS[n.type] || NOTIF_ICONS.info;
            return (
              <motion.div
                key={n.id}
                className={`adn-notif-item ${n.read ? "adn-notif-item--read" : ""}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                layout
              >
                <div className="adn-notif-icon-wrap" style={{ background: `${color}18`, color }}>
                  <Icon size={14} />
                </div>
                <div className="adn-notif-body">
                  <div className="adn-notif-item-title">{n.title}</div>
                  <div className="adn-notif-item-desc">{n.desc}</div>
                  <div className="adn-notif-item-time">
                    <Clock size={11} /> {n.time}
                  </div>
                </div>
                <div className="adn-notif-actions">
                  {!n.read && (
                    <button
                      className="adn-notif-read-btn"
                      onClick={() => onMarkRead(n.id)}
                      title="Mark as read"
                    >
                      <CheckCheck size={13} />
                    </button>
                  )}
                  <button
                    className="adn-notif-del-btn"
                    onClick={() => onClear(n.id)}
                    title="Remove"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const ref = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markRead = (id) =>
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () =>
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
  const clearOne = (id) =>
    setNotifications((ns) => ns.filter((n) => n.id !== id));

  return (
    <div className="adn-bell-wrap" ref={ref}>
      <button
        className={`adn-bell-btn ${open ? "adn-bell-btn--open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell size={17} />
        {unread > 0 && (
          <motion.span
            className="adn-bell-badge"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {unread > 9 ? "9+" : unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <NotificationPanel
            notifications={notifications}
            onMarkRead={markRead}
            onMarkAllRead={markAllRead}
            onClear={clearOne}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════
   PROFILE DROPDOWN — avatar only, 2 items
══════════════════════════════════════════ */
function ProfileDropdown({ onProfile, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="adn-profile-wrap" ref={ref}>
      {/* Avatar-only trigger */}
      <motion.button
        className={`adn-avatar-btn ${open ? "adn-avatar-btn--open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        title="Account"
      >
        <span className="adn-avatar-letter">A</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="adn-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="adn-dropdown-header">
              <div className="adn-dropdown-avatar">A</div>
              <div>
                <div className="adn-dropdown-name">Administrator</div>
                <div className="adn-dropdown-email">admin@vidyavaidya.org</div>
              </div>
            </div>

            <div className="adn-dropdown-divider" />

            <button
              className="adn-dropdown-item"
              onClick={() => { setOpen(false); onProfile(); }}
            >
              <User size={15} />
              My Profile
            </button>

            <div className="adn-dropdown-divider" />

            <button
              className="adn-dropdown-item adn-dropdown-item--danger"
              onClick={() => { setOpen(false); onLogout(); }}
            >
              <LogOut size={15} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════
   LOGOUT MODAL
══════════════════════════════════════════ */
function LogoutModal({ onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      <motion.div
        className="adn-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          className="adn-modal-box"
          initial={{ scale: 0.88, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 340, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="adn-modal-icon">
            <LogOut size={28} />
          </div>
          <h3 className="adn-modal-title">Confirm Logout</h3>
          <p className="adn-modal-desc">
            Are you sure you want to logout from the admin panel? Your current session will end.
          </p>
          <div className="adn-modal-actions">
            <button className="adn-modal-cancel" onClick={onCancel}>
              Stay Logged In
            </button>
            <button className="adn-modal-confirm" onClick={onConfirm}>
              <LogOut size={15} /> Yes, Logout
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════
   MAIN NAVBAR
══════════════════════════════════════════ */
export default function AdminNavbar({
  sidebarOpen,
  onToggleSidebar,
  activeSection,
  setActiveSection,
}) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("vv_token");
    localStorage.removeItem("vv_auth");
    localStorage.removeItem("vv_admin_auth");
    navigate("/");
  };

  return (
    <>
      <header className="adn-topbar">

        {/* ── Left: Toggle ── */}
        <div className="adn-topbar-left">
          <button
            className="adn-toggle-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} className="adn-toggle-icon" />
          </button>
        </div>

        {/* ── Center: Dynamic Breadcrumb ── */}
        <div className="adn-topbar-center-v2">
          <Breadcrumb activeSection={activeSection} />
        </div>

        {/* ── Right: Bell + Avatar ── */}
        <div className="adn-topbar-right">
          <NotificationBell />
          <div className="adn-divider-v" />
          <ProfileDropdown
            onProfile={() => setActiveSection("profile")}
            onLogout={() => setShowLogoutModal(true)}
          />
        </div>

      </header>

      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}
