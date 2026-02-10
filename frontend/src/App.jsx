import '../src/App.css'
import {Routes, Route} from 'react-router'
import AdminLayout from "./layouts/AdminLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
function App() {
  return(
    <>
      <Routes>
        <Route path="" element={<AdminLayout/>}/>
        <Route path="/employee" element={<EmployeeLayout/>}/>
      </Routes>
    </>
    
  );
}

export default App;
