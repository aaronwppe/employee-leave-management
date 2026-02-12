// layouts/AdminLayout.jsx
import { Box } from "@mui/material";
import { Outlet } from "react-router";
import Navbar from "../components/common/Navbar";

function AdminLayout() {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      
      {/* Top Navbar */}
      <Navbar role="admin" />

      {/* Page Content */}
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>

    </Box>
  );
}

export default AdminLayout;
