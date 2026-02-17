import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import LeaveForm from "../forms/LeaveForm";

const AdminLeaveDialog = ({
  open,
  onClose,
  leaves = [],
  loading,
  employee,
  onAddLeaveSuccess,
}) => {
  const [showForm, setShowForm] = useState(false);

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleLeaveCreated = async () => {
    if (onAddLeaveSuccess) {
      await onAddLeaveSuccess();
    }
    setShowForm(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Leave History — {employee?.first_name} {employee?.last_name}
      </DialogTitle>

      <DialogContent>
        {/* Add leave button */}
        {!showForm && (
          <Box mb={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              size="small"
              onClick={() => setShowForm(true)}
            >
              + Add Leave
            </Button>
          </Box>
        )}

        {/* Inline leave form */}
        {showForm && employee && (
          <Box mb={3}>
            <Paper sx={{ p: 2 }} elevation={1}>
              <LeaveForm
                accountId={employee.id}
                onClose={handleCloseForm}
                onLeaveCreated={handleLeaveCreated}
              />
            </Paper>
          </Box>
        )}

        {/* Leave list */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : !leaves.length ? (
          <Typography color="text.secondary">
            No leave history found.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {leaves.map((leave) => (
              <Paper key={leave.id} sx={{ p: 2 }} elevation={0}>
                <Typography fontWeight={500}>
                  {dayjs(leave.start_date).format("DD MMM YYYY")} –{" "}
                  {dayjs(leave.end_date).format("DD MMM YYYY")}
                </Typography>
                <Typography variant="body2">
                  {leave.total_days} days • {leave.reason}
                </Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminLeaveDialog;
