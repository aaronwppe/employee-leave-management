import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function ProtectedRoute({
  children,
  role = null,
}) {
  const { user, loading } = useAuth();

  if (loading) return <div>Authenticating...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only check role if role is provided
  if (role && user.role !== role) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/employee" replace />;
  }

  return children;
}
