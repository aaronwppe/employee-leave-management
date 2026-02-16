// import EmployeeHome from "../pages/employee/EmployeeHome";

// layouts/EmployeeLayout.jsx
import { Box } from "@mui/material";
import Navbar from "../components/common/Navbar";
import LeavePage from "../pages/employee/LeavePage";

function EmployeeLayout() {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <LeavePage />
    </Box>
  );
}

export default EmployeeLayout;
