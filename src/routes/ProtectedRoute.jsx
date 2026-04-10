import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * ProtectedRoute — wraps pages that require authentication.
 * Currently checks for a simple auth flag in sessionStorage.
 * Swap the `isAuthenticated` logic for your real auth check (Firebase, JWT, etc.)
 */
export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  // Replace this with your real auth check
  const isAuthenticated = sessionStorage.getItem("vv_auth") === "true";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", { replace: true, state: { notice: "Please login to access this page." } });
    }
  }, [navigate, isAuthenticated]);

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
