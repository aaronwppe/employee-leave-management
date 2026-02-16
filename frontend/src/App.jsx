import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import AdminLayout from "./layouts/AdminLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import Planner from "./pages/admin/Planner";
import Calendar from "./components/common/Calendar";
import LoginPage from "./pages/common/LoginPage";
import useAuth from "./context/useAuth";
import { useEffect } from "react";
import { setAuthContext } from "./services/api/client";
import LeavePage from "./pages/employee/LeavePage";
import AccountsPage from "./pages/admin/AccountsPage";
import SetPasswordPage from "./pages/common/SetPasswordPage";

export default function App() {
  const auth = useAuth();

  useEffect(() => {
    setAuthContext(auth);
  }, [auth]);

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AccountsPage />} />
        <Route path="leaves" element={<LeavePage />} />
        <Route path="planner" element={<Planner />} />
        <Route path="calendar" element={<Calendar />} />
      </Route>

      {/* Employee */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      />

      {/* Set password */}
      <Route path="/set-password" element={<SetPasswordPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
