import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router';
import AdminLayout from "./layouts/AdminLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import SetPassword from "./pages/SetPassword";
import Login from "./pages/Login"
import Planner from "./pages/admin/Planner";
import Calendar from "./components/common/Calendar";

function App() {
  return (
      <Routes>
        <Route path="/" element={<AdminLayout />} />
        <Route path="/employee" element={<EmployeeLayout />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/planner" element={<Planner/>} />
        <Route path="/calendar" element={<Calendar/>} />
      </Routes>
  );
}

export default App;
