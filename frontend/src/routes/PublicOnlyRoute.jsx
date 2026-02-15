import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Authenticating...</div>;

  if (user) {
    let page = "/";
    if (user.role === "ADMIN") {
      page = "/admin";
    }
    return <Navigate to={page} replace />;
  }

  return children;
}
