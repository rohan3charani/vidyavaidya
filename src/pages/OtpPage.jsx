import { useMemo, useState, useEffect } from "react";
import { CircleCheckBig, Mail, AlertCircle, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./OtpPage.css";

export default function OtpPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const email = useMemo(() => state?.email || "your email", [state?.email]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const [resendStatus, setResendStatus] = useState("OTP Sent! Check your inbox.");

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    setError(null);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) {
        newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);
      setError(null);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      setResendStatus("Sending...");
      await api.auth.sendOtp(email);
      setCountdown(60);
      setResendStatus("New OTP Sent! Check your inbox.");
      setError(null);
    } catch (err) {
      setResendStatus("");
      setError(err.message || "Failed to resend OTP");
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.auth.verifyOtp(email, otpCode);
      const redirect = localStorage.getItem("vv_redirect");
      if (redirect) {
        localStorage.removeItem("vv_redirect");
        navigate(redirect);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Invalid OTP code.");
    } finally {
      setLoading(false);
    }
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
          <div className="otp-container" onPaste={handlePaste}>
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

          {error && (
            <div className="otp-error" style={{ color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginTop: '10px' }}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <p className="otp-help-text">Paste allowed (Ctrl+V)</p>
          <p className="otp-resend">
            Didn't receive the code?{" "}
            <span 
              style={{ cursor: countdown === 0 ? 'pointer' : 'default', color: countdown === 0 ? '#1abc9c' : '#999', fontWeight: countdown === 0 ? '600' : 'normal' }}
              onClick={handleResend}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend Now"}
            </span>
          </p>

          <button
            type="button"
            className="otp-primary-btn"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? <Loader2 size={20} className="animate-spin mx-auto" /> : "Verify & Login"}
          </button>

          <p className="otp-info">
            Vidyavaidya Trust ensures secure access to your account to continue helping those in
            need.
          </p>

          {resendStatus && !error && (
            <div className="otp-success">
              <CircleCheckBig size={16} />
              {resendStatus}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
