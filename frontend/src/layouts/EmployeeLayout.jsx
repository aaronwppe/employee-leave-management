// layouts/EmployeeLayout.jsx
import { Box } from "@mui/material";
import { Outlet } from "react-router";
import Navbar from "../components/common/Navbar";

function EmployeeLayout() {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      
      {/* Top Navbar */}
      <Navbar role="employee" />

      {/* Page Content */}
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>

    </Box>
  );
}

export default EmployeeLayout;
