import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import AdminLayout from "./layouts/AdminLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import LoginPage from "./pages/common/LoginPage";
import useAuth from "./context/useAuth";
import { useEffect } from "react";
import { setAuthContext } from "./services/api/client";
import LeavePage from "./pages/employee/LeavePage";
import AccountsPage from "./pages/admin/AccountsPage";
import SetPasswordPage from "./pages/common/SetPasswordPage";
import { Navigate } from "react-router-dom";

export default function App() {
  const auth = useAuth();

  useEffect(() => {
    setAuthContext(auth);
  }, [auth]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AccountsPage />} />
        <Route path="/admin/leaves" element={<LeavePage />} />
      </Route>

      <Route
        path="/employee"
        element={
          <ProtectedRoute>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      />

      <Route path="/set-password" element={<SetPasswordPage />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
