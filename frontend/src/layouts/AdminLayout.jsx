// layouts/AdminLayout.jsx
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

function AdminLayout() {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      <Navbar role="ADMIN" />

      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default AdminLayout;
