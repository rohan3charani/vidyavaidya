import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, Lock, User } from "lucide-react";
import vidyaLogo from "../../assets/Vidya1.png";
import "./AdminLogin.css";

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "vidyavaidya@2024",
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (
        username.trim() === ADMIN_CREDENTIALS.username &&
        password === ADMIN_CREDENTIALS.password
      ) {
        localStorage.setItem("vv_admin_auth", JSON.stringify({ loggedIn: true, time: Date.now() }));
        navigate("/admin/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="admin-login-root">
      
      {/* ── Left Pane: Animated Background Logo ── */}
      <div className="al-left-pane">
        <div className="al-bg-effects">
          <div className="al-orb al-orb-1" />
          <div className="al-orb al-orb-2" />
        </div>
        
        <div className="al-logo-container">
          <div className="al-logo-glow" />
          <img src={vidyaLogo} alt="VidyaVaidya Logo" />
        </div>
      </div>

      {/* ── Right Pane: Form Card ── */}
      <div className="al-right-pane">
        <div className={`al-card ${shake ? "al-shake" : ""}`}>
          
          <div className="al-brand">
            <div className="al-shield">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1>VidyaVaidya</h1>
              <span>Admin Control Panel</span>
            </div>
          </div>

          <div className="al-divider" />

          <h2>Sign in to continue</h2>
          <p className="al-sub">Restricted access — authorised personnel only</p>

          <form className="al-form" onSubmit={handleLogin}>
            <div className="al-field">
              <label htmlFor="admin-username">Username</label>
              <div className="al-input-wrap">
                <User size={16} />
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  required
                />
              </div>
            </div>

            <div className="al-field">
              <label htmlFor="admin-password">Password</label>
              <div className="al-input-wrap">
                <Lock size={16} />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  required
                />
                <button
                  type="button"
                  className="al-eye-btn"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="al-error" role="alert">
                <span>⚠</span> {error}
              </div>
            )}

            <button
              type="submit"
              className={`al-submit ${loading ? "al-loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="al-spinner" /> Verifying…
                </>
              ) : (
                <>
                  <ShieldCheck size={16} /> Access Dashboard
                </>
              )}
            </button>
          </form>

          <p className="al-back-link">
            <a href="/">← Back to main website</a>
          </p>

          <div className="al-hint-box">
            <strong>Demo credentials:</strong>
            <code>admin / vidyavaidya@2024</code>
          </div>
          
        </div>
      </div>

    </div>
  );
}
