import React from "react";
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

const AdminLeaveDialog = ({
  open,
  onClose,
  leaves = [],
  loading,
  employee,
  onAddLeave,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Leave History — {employee?.first_name} {employee?.last_name}
      </DialogTitle>

      <DialogContent>
        <Box mb={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            size="small"
            onClick={onAddLeave}
          >
            + Add Leave
          </Button>
        </Box>

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
