import EmployeeOnboard from "../forms/EmployeeForm";
import EmployeeTable from "../../components/tables/EmployeeTable";

const handleEmployeeCreated = (employee) => {
    console.log("New employee created:", employee);
};

export default function AdminHome() {
  return (
    <div>
      <EmployeeOnboard onEmployeeCreated={handleEmployeeCreated} />;
      <EmployeeTable />
    </div>
  );
}

 
