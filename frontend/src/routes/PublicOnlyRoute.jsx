import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Authenticating...</div>;

  if (user) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/employee" replace />;
  }

  return children;
}
