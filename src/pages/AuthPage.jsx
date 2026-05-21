import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, User, Phone, KeyRound, ArrowRight } from "lucide-react";
import api from "../services/api";
import vidyaLogo from "../assets/Vidya1.png";
import "./AuthPage.css";

const LEFT_CONTENT = {
  heading: "Empowering Lives Through Healthcare and Education",
  description:
    "Vidyavaidya Trust is dedicated to supporting underprivileged children by providing access to quality education and healthcare. Together, we can build a healthier and brighter future.",
  quote: '"Helping a child today creates a better tomorrow."',
  extra: "We support poor children with education and healthcare.",
};

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(location.state?.tab === "signup" ? "signup" : "login");
  const [loginEmail, setLoginEmail] = useState(location.state?.email || "");
  const [signupEmail, setSignupEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [signupNotice, setSignupNotice] = useState(location.state?.notice || "");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigate(location.pathname, { replace: true, state: null });
  }, [navigate, location.pathname]);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPhone = (value) => /^\d{10}$/.test(value);
  const isValidName = (value) => /^[A-Za-z ]{3,}$/.test(value.trim());

  const goToOtp = async () => {
    const nextErrors = {};
    const value = loginEmail.trim();
    const isPhone = /^\+?\d/.test(value);

    if (!value) {
      nextErrors.loginEmail = "Email address / Phone number is required";
    } else if (isPhone) {
      const cleanPhone = value.replace(/[-\s()]/g, "");
      if (!/^(\+?\d{1,4})?\d{10}$/.test(cleanPhone)) {
        nextErrors.loginEmail = "Enter a valid 10-digit phone number";
      }
    } else {
      if (!isValidEmail(value)) {
        nextErrors.loginEmail = "Enter a valid email address";
      }
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      // Request OTP from the backend
      const res = await api.auth.sendOtp(value);

      const targetEmail = res.email || value;
      navigate("/otp", { state: { email: targetEmail } });
    } catch (err) {
      setErrorMessage(err.message || "This account is not registered. Please register first.");
      setShowErrorPopup(true);
      setErrors({ loginEmail: err.message || "Failed to contact authorization server" });
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async () => {
    const nextErrors = {};
    if (!isValidName(fullName)) {
      nextErrors.fullName = "Enter a valid full name (minimum 3 letters)";
    }
    if (!signupEmail.trim()) {
      nextErrors.signupEmail = "Email is required";
    } else if (!isValidEmail(signupEmail.trim())) {
      nextErrors.signupEmail = "Enter a valid email address";
    }
    if (!phone.trim()) {
      nextErrors.phone = "Phone number is required";
    } else if (!isValidPhone(phone.trim())) {
      nextErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setLoading(true);
    try {
      // Call standard register API with a secure default portal password
      await api.auth.register(
        signupEmail.trim(),
        phone.trim(),
        fullName.trim(),
        "Vidyavaidya@2026"
      );

      setShowSuccessPopup(true);

      setTimeout(() => {
        setActiveTab("login");
        setLoginEmail(signupEmail.trim());
        setSignupNotice("Account created");
        setSignupEmail("");
        setFullName("");
        setPhone("");
        setShowSuccessPopup(false);

        navigate("/auth", {
          replace: true,
          state: {
            tab: "login",
            email: signupEmail.trim(),
            notice: "Account created",
          },
        });
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message || "An account with this email or phone number already exists.");
      setShowErrorPopup(true);
      setErrors({ signupEmail: err.message || "Email or phone number already registered" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
        <div className="auth-left-pane">
          <div className="al-bg-effects">
            <div className="al-orb al-orb-1" />
            <div className="al-orb al-orb-2" />
          </div>
          
          <div className="al-logo-container">
            <div className="al-logo-glow" />
            <img src={vidyaLogo} alt="VidyaVaidya Logo" />
          </div>
        </div>

        <div className="auth-right-pane">
          <div className="auth-card">
            {showSuccessPopup && (
              <div className="success-popup-overlay">
                <div className="success-popup-content">
                  <svg className="checkmark-svg" viewBox="0 0 52 52">
                    <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none"/>
                    <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                  </svg>
                  <h3 className="success-popup-title">Account Created!</h3>
                  <p className="success-popup-msg">
                    Welcome to the Vidya Vaidya family. Redirecting to login...
                  </p>
                  <div className="redirect-countdown-bar">
                    <div className="redirect-progress-fill"></div>
                  </div>
                </div>
              </div>
            )}
            {showErrorPopup && (
              <div className="error-popup-overlay">
                <div className="error-popup-content">
                  <div className="error-popup-icon">⚠️</div>
                  <h3 className="error-popup-title">Authentication Alert</h3>
                  <p className="error-popup-msg">{errorMessage}</p>
                  <button type="button" className="error-popup-close-btn" onClick={() => setShowErrorPopup(false)}>
                    Understood
                  </button>
                </div>
              </div>
            )}
            <h2>{activeTab === "login" ? "Welcome Back!" : "Create an account"}</h2>
            <p className="auth-subtitle">
              {activeTab === "login"
                ? "Login to your Vidyavaidya account"
                : "Become a part of Vidya Vaidya Family today!"}
            </p>

          <div className="auth-tabs">
            <button
              type="button"
              className={activeTab === "login" ? "active" : ""}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={activeTab === "signup" ? "active" : ""}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

            {activeTab === "login" ? (
              <div className="auth-form">
                <label>Email Address / Phone Number *</label>
                <div className={`input-wrap ${errors.loginEmail ? "input-error" : ""}`}>
                  {/^\+?\d/.test(loginEmail.trim()) ? <Phone size={16} /> : <Mail size={16} />}
                  <input
                    type="text"
                    placeholder="Enter your registered email / phone number"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, loginEmail: "" }));
                    }}
                  />
                </div>
                {errors.loginEmail && <p className="field-error">{errors.loginEmail}</p>}
                {signupNotice && <p className="success-note">{signupNotice}</p>}
                <button type="button" className="auth-primary-btn" onClick={goToOtp} disabled={loading}>
                  {loading ? "Sending OTP..." : "Continue"} <ArrowRight size={16} />
                </button>
                <p className="auth-footer">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("signup");
                      setSignupNotice("");
                      setErrors({});
                    }}
                  >
                    Register
                  </button>
                </p>
              </div>
            ) : (
              <div className="auth-form">
                <label>Full Name *</label>
                <div className={`input-wrap ${errors.fullName ? "input-error" : ""}`}>
                  <User size={16} />
                  <input
                    type="text"
                    placeholder="Vidya"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setErrors((prev) => ({ ...prev, fullName: "" }));
                    }}
                  />
                </div>
                {errors.fullName && <p className="field-error">{errors.fullName}</p>}

                <label>Email *</label>
                <div className={`input-wrap ${errors.signupEmail ? "input-error" : ""}`}>
                  <Mail size={16} />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={signupEmail}
                    onChange={(e) => {
                      setSignupEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, signupEmail: "" }));
                    }}
                  />
                </div>
                {errors.signupEmail && <p className="field-error">{errors.signupEmail}</p>}

                <label>Code* Phone Number *</label>
                <div className="phone-group">
                  <div className="code-wrap">
                    <KeyRound size={14} />
                    <input type="text" value="+91" readOnly />
                  </div>
                  <div className={`input-wrap ${errors.phone ? "input-error" : ""}`}>
                    <Phone size={16} />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                        setErrors((prev) => ({ ...prev, phone: "" }));
                      }}
                    />
                  </div>
                </div>
                {errors.phone && <p className="field-error">{errors.phone}</p>}

                <button type="button" className="auth-primary-btn" onClick={createAccount} disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            )}
          </div>
        </div>
    </section>
  );
}
