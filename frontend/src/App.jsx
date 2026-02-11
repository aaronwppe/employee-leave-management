import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router';
import AdminLayout from "./layouts/AdminLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import SetPassword from "./pages/SetPassword";

function App() {
  return (
      <Routes>
        <Route path="/" element={<AdminLayout />} />
        <Route path="/employee" element={<EmployeeLayout />} />
        <Route path="/set-password" element={<SetPassword />} />
      </Routes>
  );
}

export default App;
