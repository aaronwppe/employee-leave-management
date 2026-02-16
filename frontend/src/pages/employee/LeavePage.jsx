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
        year: new Date().getFullYear(),
      });
      setLeaveData(data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    fetchAccountData();
    fetchLeaves();
  }, [fetchAccountData, fetchLeaves]);

  // After leave created
  const handleLeaveCreated = async () => {
    await fetchAccountData();
    await fetchLeaves();
  };

  // Delete leave
  const handleDeleteLeave = async (leaveId) => {
    try {
      await deleteLeave(leaveId);
      await fetchLeaves();
      await fetchAccountData();
    } catch (error) {
      console.error("Error deleting leave:", error);
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 4,
          }}
        >
          <Button
            variant="contained"
            sx={{ borderRadius: 3, px: 4, fontWeight: "bold" }}
            onClick={() => setOpenForm(true)}
          >
            Apply Leave
          </Button>
        </Box>

        {/* CARDS */}
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  Allocated Leaves <br />(current year)
                </Typography>
                <Typography variant="h3" sx={{ mt: 2, fontWeight: "bold" }}>
                  {accountData?.allocated_leaves || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  Remaining Leaves
                </Typography>
                <Typography variant="h3" sx={{ mt: 2, fontWeight: "bold" }}>
                  {accountData?.remaining_leaves || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  Exhausted Leaves
                </Typography>
                <Typography variant="h3" sx={{ mt: 2, fontWeight: "bold" }}>
                  {accountData?.leaves_exhausted || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* LEAVE HISTORY TABLE */}
        <LeaveHistoryTable
          leaves={leaveData}
          onDelete={handleDeleteLeave}
          loading={loading}
          year={new Date().getFullYear()}
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
  height: 200,
  width: "100%",
  borderRadius: 4,
  backgroundColor: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
  },
};

export default LeavePage;
