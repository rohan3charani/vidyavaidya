import { useMemo, useState } from "react";
import { CircleCheckBig, Mail } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import vidyaLogo from "../assets/Vidya1.png";
import "./OtpPage.css";

export default function OtpPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const email = useMemo(() => state?.email || "your email", [state?.email]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
  };

  return (
    <section className="otp-layout">
      <div className="otp-left-pane">
        <div className="al-bg-effects">
          <div className="al-orb al-orb-1" />
          <div className="al-orb al-orb-2" />
        </div>
        
        <div className="al-logo-container">
          <div className="al-logo-glow" />
          <img src={vidyaLogo} alt="VidyaVaidya Logo" />
        </div>
      </div>

      <div className="otp-right-pane">
        <div className="auth-card otp-card">
          <h2>Verify Your Email</h2>
          <p className="otp-subtitle">Enter the 6-digit code sent to your email</p>

          <div className="otp-email-pill">
            <Mail size={15} />
            <div>
              <p>OTP sent to your email</p>
              <strong>{email}</strong>
            </div>
            <button
              type="button"
              onClick={() => navigate("/auth", { state: { tab: "login", email } })}
            >
              Edit
            </button>
          </div>

          <p className="otp-title">Enter 6-Digit Code</p>
          <div className="otp-container">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                className="otp-input"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                inputMode="numeric"
              />
            ))}
          </div>

          <p className="otp-help-text">Paste allowed (Ctrl+V)</p>
          <p className="otp-resend">Didn't receive the code? Resend in 29s</p>

          <button
            type="button"
            className="otp-primary-btn"
            onClick={() => {
              localStorage.setItem("vv_auth", "1");

              // Dynamically populate default user profile details if none exists in localStorage
              const existingProfile = localStorage.getItem("vv_user_profile");
              if (!existingProfile) {
                const calculatedName = email.split("@")[0].toUpperCase().replace(/[._-]/g, " ");
                localStorage.setItem("vv_user_profile", JSON.stringify({
                  fullName: calculatedName || "GUEST USER",
                  email: email,
                  mobile: "+91 9999999999",
                  isAlumni: true,
                  alumniId: "VV-2026-042",
                  gradYear: "2022",
                  address: "Nellore, Andhra Pradesh",
                  city: "Nellore",
                  state: "Andhra Pradesh",
                  country: "India",
                  pincode: "524001"
                }));
              }

              const redirect = localStorage.getItem("vv_redirect");
              if (redirect) {
                localStorage.removeItem("vv_redirect");
                navigate(redirect);
              } else {
                navigate("/dashboard");
              }
            }}
          >
            Verify &amp; Login
          </button>

          <p className="otp-info">
            Vidyavaidya Trust ensures secure access to your account to continue helping those in
            need.
          </p>

          <div className="otp-success">
            <CircleCheckBig size={16} />
            OTP Sent! Check your inbox.
          </div>
        </div>
      </div>
    </section>
  );
}
