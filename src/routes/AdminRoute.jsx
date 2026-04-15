import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const auth = localStorage.getItem("vv_admin_auth");
  if (!auth) return <Navigate to="/admin" replace />;
  try {
    const { loggedIn } = JSON.parse(auth);
    if (!loggedIn) return <Navigate to="/admin" replace />;
  } catch {
    return <Navigate to="/admin" replace />;
  }
  return children;
}
