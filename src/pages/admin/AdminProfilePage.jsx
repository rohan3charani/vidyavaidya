import { useState, useRef } from "react";
import {
  User, Mail, Phone, Shield, Calendar, Camera, Eye, EyeOff,
  Save, Lock, CheckCircle, AlertCircle, Loader2, Edit3, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`ap-toast ap-toast--${toast.type}`}
        >
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InputField({ label, icon: Icon, value, onChange, type = "text", readOnly = false, placeholder }) {
  return (
    <div className="ap-field">
      <label className="ap-label">{label}</label>
      <div className={`ap-input-wrap ${readOnly ? "ap-readonly" : ""}`}>
        <Icon size={16} className="ap-input-icon" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder || label}
          className="ap-input"
        />
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle, placeholder }) {
  return (
    <div className="ap-field">
      <label className="ap-label">{label}</label>
      <div className="ap-input-wrap">
        <Lock size={16} className="ap-input-icon" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder || label}
          className="ap-input"
        />
        <button type="button" className="ap-eye-btn" onClick={onToggle} tabIndex={-1}>
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

export default function AdminProfilePage({ showToast }) {
  const adminInfo = (() => {
    try {
      const auth = JSON.parse(localStorage.getItem("vv_admin_auth") || "{}");
      return auth;
    } catch { return {}; }
  })();

  const [profile, setProfile] = useState({
    fullName: adminInfo.fullName || "Administrator",
    email: adminInfo.email || "admin@vidyavaidya.org",
    phone: adminInfo.phone || "+91 98765 43210",
    role: "Super Administrator",
    joinedDate: adminInfo.time
      ? new Date(adminInfo.time).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
      : new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
  });

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState(null);
  const fileRef = useRef();

  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, newPass: false, confirm: false });
  const [pwSaving, setPwSaving] = useState(false);

  const [localToast, setLocalToast] = useState(null);

  const fireToast = (message, type = "success") => {
    setLocalToast({ message, type });
    setTimeout(() => setLocalToast(null), 3500);
    if (showToast) showToast(message, type);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarUrl(ev.target.result);
    reader.readAsDataURL(file);
    fireToast("Profile photo updated!", "success");
  };

  const handleSaveProfile = async () => {
    if (!profile.fullName.trim()) {
      fireToast("Full name cannot be empty.", "error");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900)); // simulate API
    setSaving(false);
    setEditMode(false);
    fireToast("Profile updated successfully!", "success");
  };

  const handlePasswordReset = async () => {
    if (!passwords.current) {
      fireToast("Please enter your current password.", "error");
      return;
    }
    if (passwords.newPass.length < 6) {
      fireToast("New password must be at least 6 characters.", "error");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      fireToast("New passwords do not match.", "error");
      return;
    }
    setPwSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setPwSaving(false);
    setPasswords({ current: "", newPass: "", confirm: "" });
    fireToast("Password changed successfully!", "success");
  };

  return (
    <div className="adm-section">
      <Toast toast={localToast} />

      {/* Page Header */}
      <div className="adm-section-header">
        <h2>Admin Profile</h2>
        <p>Manage your personal information and security settings</p>
      </div>

      <div className="ap-layout">

        {/* LEFT — Avatar + Quick Info */}
        <motion.div
          className="ap-card ap-avatar-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="ap-avatar-wrap" onClick={() => fileRef.current.click()} title="Change photo">
            <div className="ap-avatar-circle">
              {avatarUrl
                ? <img src={avatarUrl} alt="Admin" className="ap-avatar-img" />
                : <span className="ap-avatar-letter">{(profile.fullName[0] || "A").toUpperCase()}</span>
              }
              <div className="ap-avatar-overlay">
                <Camera size={24} className="ap-camera-icon" />
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
          </div>

          <h3 className="ap-card-name">{profile.fullName}</h3>

          <div className="ap-info-pills">
            <div className="ap-info-pill">
              <Mail size={13} />
              <span>{profile.email}</span>
            </div>
            <div className="ap-info-pill">
              <Phone size={13} />
              <span>{profile.phone}</span>
            </div>
            <div className="ap-info-pill">
              <Calendar size={13} />
              <span>Joined {profile.joinedDate}</span>
            </div>
          </div>

          <div className="ap-status-indicator">
            <span className="ap-status-dot" />
            Active Session
          </div>
        </motion.div>

        {/* RIGHT — Edit Profile + Password Reset */}
        <div className="ap-right-col">

          {/* Profile Edit Card */}
          <motion.div
            className="ap-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="ap-card-header">
              <div className="ap-card-title">
                <Edit3 size={16} />
                Profile Information
              </div>
              {!editMode ? (
                <button className="ap-edit-btn" onClick={() => setEditMode(true)}>
                  <Edit3 size={14} /> Edit Profile
                </button>
              ) : (
                <button className="ap-cancel-btn" onClick={() => setEditMode(false)}>
                  <X size={14} /> Cancel
                </button>
              )}
            </div>

            <div className="ap-fields-grid">
              <InputField
                label="Full Name"
                icon={User}
                value={profile.fullName}
                onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                readOnly={!editMode}
                placeholder="Full Name"
              />
              <InputField
                label="Email Address"
                icon={Mail}
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                readOnly={!editMode}
                placeholder="Email"
              />
              <InputField
                label="Phone Number"
                icon={Phone}
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                readOnly={!editMode}
                placeholder="Phone"
              />

              <InputField
                label="Member Since"
                icon={Calendar}
                value={profile.joinedDate}
                readOnly
              />
            </div>

            {editMode && (
              <motion.div
                className="ap-save-row"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button
                  className="ap-save-btn"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? <Loader2 size={15} className="ap-spin" /> : <Save size={15} />}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Password Reset Card */}
          <motion.div
            className="ap-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="ap-card-header">
              <div className="ap-card-title">
                <Lock size={16} />
                Change Password
              </div>
            </div>

            <div className="ap-fields-grid">
              <PasswordField
                label="Current Password"
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                show={showPw.current}
                onToggle={() => setShowPw((s) => ({ ...s, current: !s.current }))}
                placeholder="Enter current password"
              />
              <PasswordField
                label="New Password"
                value={passwords.newPass}
                onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
                show={showPw.newPass}
                onToggle={() => setShowPw((s) => ({ ...s, newPass: !s.newPass }))}
                placeholder="At least 6 characters"
              />
              <PasswordField
                label="Confirm New Password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                show={showPw.confirm}
                onToggle={() => setShowPw((s) => ({ ...s, confirm: !s.confirm }))}
                placeholder="Re-enter new password"
              />
            </div>

            {/* Strength indicator */}
            {passwords.newPass && (
              <div className="ap-strength-bar">
                <div
                  className={`ap-strength-fill ap-strength-${passwords.newPass.length < 6 ? "weak" : passwords.newPass.length < 10 ? "medium" : "strong"}`}
                  style={{ width: `${Math.min(passwords.newPass.length * 10, 100)}%` }}
                />
                <span className="ap-strength-label">
                  {passwords.newPass.length < 6 ? "Weak" : passwords.newPass.length < 10 ? "Medium" : "Strong"}
                </span>
              </div>
            )}

            <div className="ap-save-row">
              <button
                className="ap-save-btn ap-save-btn--purple"
                onClick={handlePasswordReset}
                disabled={pwSaving}
              >
                {pwSaving ? <Loader2 size={15} className="ap-spin" /> : <Lock size={15} />}
                {pwSaving ? "Changing…" : "Change Password"}
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
