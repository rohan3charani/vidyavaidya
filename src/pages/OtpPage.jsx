import { useMemo, useState } from "react";
import { CircleCheckBig, Mail } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
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
        <div className="otp-left-content">
          <h1>Empowering Lives Through Healthcare and Education</h1>
          <p>
            Vidyavaidya Trust is dedicated to supporting underprivileged children by providing
            access to quality education and healthcare. Together, we can build a healthier and
            brighter future.
          </p>
          <p className="otp-quote">"Helping a child today creates a better tomorrow."</p>
          <p>We support poor children with education and healthcare.</p>
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
