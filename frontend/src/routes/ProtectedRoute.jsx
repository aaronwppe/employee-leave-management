import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function ProtectedRoute({
  children,
  role = "EMPLOYEE",
  redirectTo = "/",
}) {
  const { user, loading } = useAuth();

  if (loading) return <div>Authenticating...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
