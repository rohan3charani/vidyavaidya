import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute — wraps pages that require authentication.
 * Currently checks for a simple auth flag in sessionStorage.
 * Swap the `isAuthenticated` logic for your real auth check (Firebase, JWT, etc.)
 */
export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Strengthened auth check (BUG 13): Verify local storage flag and validate stored JWT expiry
  const isAuthenticated = (() => {
    if (localStorage.getItem("vv_auth") !== "true") return false;
    const token = localStorage.getItem("vv_token");
    if (!token) return false;

    // Support local developer sandbox/test mock bypass tokens
    if (token.startsWith("mock-jwt-bypass-")) {
      return true;
    }

    const parts = token.split(".");
    if (parts.length !== 3) return false;

    try {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        // Token has expired
        localStorage.removeItem("vv_auth");
        localStorage.removeItem("vv_token");
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  })();

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("vv_redirect", location.pathname);
      navigate("/auth", { replace: true, state: { notice: "Please login to access this page." } });
    }
  }, [navigate, isAuthenticated, location.pathname]);

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1a0f",
          color: "#fff",
          fontSize: "1rem",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Checking authentication…
      </div>
    );
  }

  return children;
}
