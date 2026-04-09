import { useState } from "react";
import { Mail, User, Phone, KeyRound, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
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

  const [activeTab, setActiveTab] = useState(() => location.state?.tab === "signup" ? "signup" : "login");
  const [loginEmail, setLoginEmail] = useState(() => location.state?.email || "");
  const [signupEmail, setSignupEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [signupNotice, setSignupNotice] = useState(() => location.state?.notice || "");

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPhone = (value) => /^\d{10}$/.test(value);
  const isValidName = (value) => /^[A-Za-z ]{3,}$/.test(value.trim());

  const goToOtp = () => {
    const nextErrors = {};
    if (!loginEmail.trim()) {
      nextErrors.loginEmail = "Email is required";
    } else if (!isValidEmail(loginEmail.trim())) {
      nextErrors.loginEmail = "Enter a valid email address";
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    navigate("/otp", { state: { email: loginEmail.trim() } });
  };

  const createAccount = () => {
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

    setSignupNotice("Account created successfully. Please login to continue.");
    navigate("/auth", {
      state: {
        tab: "login",
        email: signupEmail.trim(),
        notice: "Account created successfully. Please login to continue.",
      },
    });
  };

  return (
    <section className="auth-layout">
        <div className="auth-left-pane">
          <div className="auth-left-content">
            <h1>{LEFT_CONTENT.heading}</h1>
            <p className="auth-left-description">{LEFT_CONTENT.description}</p>
            <p className="auth-left-quote">{LEFT_CONTENT.quote}</p>
            <p className="auth-left-extra">{LEFT_CONTENT.extra}</p>
          </div>
        </div>

        <div className="auth-right-pane">
          <div className="auth-card">
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
                <label>Email Address *</label>
                <div className={`input-wrap ${errors.loginEmail ? "input-error" : ""}`}>
                  <Mail size={16} />
                  <input
                    type="email"
                    placeholder="Enter Your Registered Email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, loginEmail: "" }));
                    }}
                  />
                </div>
                {errors.loginEmail && <p className="field-error">{errors.loginEmail}</p>}
                {signupNotice && <p className="success-note">{signupNotice}</p>}
                <button type="button" className="auth-primary-btn" onClick={goToOtp}>
                  Continue with Email <ArrowRight size={16} />
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

                <button type="button" className="auth-primary-btn" onClick={createAccount}>
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
    </section>
  );
}
