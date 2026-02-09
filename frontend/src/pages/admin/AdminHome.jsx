import EmployeeOnboard from "../forms/EmployeeForm";

function AdminHome() {

  const handleEmployeeCreated = (employee) => {
    console.log("New employee created:", employee);
  };

  return <EmployeeOnboard onEmployeeCreated={handleEmployeeCreated} />;
}

export default AdminHome;
