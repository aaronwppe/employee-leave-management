import "./App.css";
import { Routes, Route } from 'react-router';
import AdminLayout from "./layouts/AdminLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import SetPassword from "./pages/SetPassword";
import Login from "./pages/Login"
import LeaveForm from "./components/forms/LeaveForm";
import AdminHome from "./pages/admin/AdminHome";
import EmployeeHome from "./pages/employee/EmployeeHome";
import AdminLeaveForm from "./components/forms/AdminLeaveForm";

function App() {
  return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />} />
        <Route index element={<AdminHome/>} />
        <Route path="/employee" element={<EmployeeLayout />} />
        <Route path="/home" element={<EmployeeHome/>} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/apply-leave" element={<LeaveForm/>} />
        <Route path="/admin/leave" element={<AdminLeaveForm/>} />
      </Routes>
  );
}

export default App;
