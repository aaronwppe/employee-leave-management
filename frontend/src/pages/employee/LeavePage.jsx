import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Container,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import LeaveForm from "../../components/forms/LeaveForm";
import LeaveHistoryTable from "../../components/tables/LeaveHistoryTable";
import { getAccountById } from "../../services/api/account.api";
import { getLeaves, deleteLeave } from "../../services/api/leave.api";
import useAuth from "../../context/useAuth";

function LeavePage() {
  const [openForm, setOpenForm] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { user } = useAuth();

  // Fetch account info
  const fetchAccountData = useCallback(async () => {
    if (!user) return;

    try {
      const data = await getAccountById(user.id);
      setAccountData(data);
    } catch (error) {
      console.error("Error fetching account:", error);
    }
  }, [user]);

  // Fetch leave history
  const fetchLeaves = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getLeaves({
        year: selectedYear,
      });
      setLeaveData(data || []);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedYear]); // FIX: added selectedYear

  // Load account data once
  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  // Reload leaves when year changes
  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // After leave created
  const handleLeaveCreated = async () => {
    await fetchAccountData();
    await fetchLeaves();
  };

  // Delete leave
  const handleDeleteLeave = async (leaveId) => {
    try {
      await deleteLeave(leaveId);

      // remove leave instantly from UI
      setLeaveData((prev) => prev.filter((l) => l.id !== leaveId));

      // refresh account data for cards
      await fetchAccountData();
    } catch (error) {
      console.error("Error deleting leave:", error);
    }
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 1 }}>
        {/* CARDS */}
        <Grid container spacing={3} justifyContent="center">
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={cardStyle}>
              <CardContent>
                <EventAvailableIcon sx={{ fontSize: 40, color: "#1976d2" }} />
                <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                  Allocated Leaves (Current Year)
                </Typography>
                <Typography variant="h2" sx={{ mt: 1, fontWeight: "bold" }}>
                  {accountData?.allocated_leaves || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={cardStyle}>
              <CardContent>
                <AccessTimeIcon sx={{ fontSize: 40, color: "#2e7d32" }} />
                <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                  Remaining Leaves
                </Typography>
                <Typography variant="h2" sx={{ mt: 1, fontWeight: "bold" }}>
                  {accountData?.remaining_leaves || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={cardStyle}>
              <CardContent>
                <EventBusyIcon sx={{ fontSize: 40, color: "#d32f2f" }} />
                <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                  Exhausted Leaves
                </Typography>
                <Typography variant="h2" sx={{ mt: 1, fontWeight: "bold" }}>
                  {accountData?.leaves_exhausted || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* apply button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            my: 2,
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: 3,
              px: 5,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "1rem",
            }}
            onClick={() => setOpenForm(true)}
          >
            Apply Leave
          </Button>
        </Box>

        {/* LEAVE HISTORY TABLE */}
        <LeaveHistoryTable
          leaves={leaveData}
          onDelete={handleDeleteLeave}
          loading={loading}
          year={selectedYear}
          setYear={setSelectedYear}
        />
      </Container>

      {openForm && (
        <LeaveForm
          onClose={() => setOpenForm(false)}
          onLeaveCreated={handleLeaveCreated}
        />
      )}
    </>
  );
}

const cardStyle = {
  height: 240,
  width: "100%",
  borderRadius: 4,
  backgroundColor: "#f9fbfd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  transition: "all 0.3s ease",
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
  },
};

export default LeavePage;
