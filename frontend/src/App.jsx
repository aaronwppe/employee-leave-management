import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router';
import AdminLayout from "./layouts/AdminLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import SetPassword from "./pages/SetPassword";
import Login from "./pages/Login"

function App() {
  return (
      <Routes>
        <Route path="/" element={<AdminLayout />} />
        <Route path="/employee" element={<EmployeeLayout />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/login" element={<Login/>} />
      </Routes>
  );
}

export default App;
