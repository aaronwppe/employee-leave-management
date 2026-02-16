import { Routes, Route, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

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

  // 🎨 Create custom theme
  const theme = createTheme({
    palette: {
      primary: {
        main: "#081250",   // Your ELMS dark blue
        light: "#0a1a70",
        dark: "#050a30",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#1976d2",
      },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
      button: {
        textTransform: "none", // removes uppercase buttons globally
      },
    },
    shape: {
      borderRadius: 12, // Global rounded UI
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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

        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
