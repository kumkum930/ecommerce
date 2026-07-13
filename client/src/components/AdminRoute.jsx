import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Guards admin-only routes. Redirects non-admins (and logged-out users) home.
export default function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
}
