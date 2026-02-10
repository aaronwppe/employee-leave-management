import Navbar from "../../components/common/Navbar";
import LeaveCard from "../../components/cards/LeaveCard";
import LeaveHistoryTable from "../../components/tables/LeaveHistoryTable";
import LeaveForm from "../../components/forms/LeaveForm";

function EmployeeHome() {
  return (
    <div>
      <Navbar />

      <h2>Employee Dashboard</h2>

      <div className="cards">
        <LeaveCard title="Total Leave" value={20} />
        <LeaveCard title="Taken Leave" value={8} />
        <LeaveCard title="Remaining Leave" value={12} />
      </div>

      <LeaveHistoryTable />
      <LeaveForm />
    </div>
  );
}

export default EmployeeHome;
