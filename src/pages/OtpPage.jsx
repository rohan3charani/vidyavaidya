import { useMemo, useState, useEffect } from "react";
import { CircleCheckBig, Mail, Phone, AlertCircle, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import vidyaLogo from "../assets/Vidya1.png";
import "./OtpPage.css";

export default function OtpPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const email = useMemo(() => state?.email || "your email or phone", [state?.email]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const [resendStatus, setResendStatus] = useState("OTP Sent! Check your email or SMS messages.");

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

    // Auto-advance to next input box
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Shift focus to previous input box on Backspace if current box is already empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
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
      // Focus the last filled input
      const focusIndex = Math.min(pasteData.length, 5);
      const inputToFocus = document.getElementById(`otp-input-${focusIndex === 6 ? 5 : focusIndex}`);
      if (inputToFocus) inputToFocus.focus();
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      setResendStatus("Sending...");
      await api.auth.sendOtp(email);
      setCountdown(60);
      setResendStatus("New OTP Sent! Check your email or SMS messages.");
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

  const isEmailFormat = useMemo(() => email.includes("@"), [email]);

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
          <h2>Verify Your Account</h2>
          <p className="otp-subtitle">Enter the 6-digit OTP sent to your email address and mobile number</p>

          <div className="otp-email-pill">
            {isEmailFormat ? <Mail size={15} /> : <Phone size={15} />}
            <div>
              <p>OTP sent to your registered email and mobile number</p>
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
                id={`otp-input-${idx}`}
                className="otp-input"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                inputMode="numeric"
                type="text"
                autoComplete="one-time-code"
                data-lpignore="true"
                data-1pignore="true"
                name={`otp-field-${idx}`}
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
            Vidyavaidya Trust ensures secure access to your account through email and mobile OTP verification.
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
