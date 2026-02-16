import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  TableContainer,
  Typography,
  CircularProgress,
  Box,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import DeleteIcon from "@mui/icons-material/Delete";
import '../../App.css'

function LeaveHistoryTable({
  leaves = [],
  onDelete,
  loading,
  year,
}) {
  // Pagination
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  // Delete dialog
  const [openDelete, setOpenDelete] = useState(false);
  const [leaveId, setLeaveId] = useState(null);

  // Sort leaves by start date
  const sorted = useMemo(() => {
    return [...leaves].sort(
      (a, b) => dayjs(a.start_date).valueOf() - dayjs(b.start_date).valueOf()
    );
  }, [leaves]);

  const handleDeleteOpen = (id) => {
    setLeaveId(id);
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
    setLeaveId(null);
  };

  const handleDeleteConfirm = () => {
    if (leaveId) {
      onDelete(leaveId);
    }
    handleDeleteClose();
  };

  if (loading) {
    return (
      <Box mt={2} textAlign="center">
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!leaves.length) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: "center" }}
      >
        No leaves applied for {year}.
      </Typography>
    );
  }

  return (
    <Box mt={4}>
      {/* Header */}
      <Box
        className={"TopBar"}
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <CalendarViewMonthIcon />
        <Typography
          sx={{ marginLeft: "15px", fontWeight: "bold" }}
          variant="subtitle2"
        >
          Leave History
        </Typography>
      </Box>

      <Typography
        variant="subtitle2"
        sx={{
          mb: 1,
          fontWeight: 600,
        }}
      >
        Total leaves: {leaves.length}
      </Typography>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "rgba(0,0,0,0.04)",
              }}
            >
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell width={50}></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sorted
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((leave) => (
                <TableRow
                  key={leave.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.03)",
                    },
                  }}
                >
                  <TableCell>
                    {dayjs(leave.start_date).format("DD MMM YYYY")}
                  </TableCell>

                  <TableCell>
                    {dayjs(leave.end_date).format("DD MMM YYYY")}
                  </TableCell>

                  <TableCell>{leave.total_days}</TableCell>

                  <TableCell>{leave.reason}</TableCell>

                  <TableCell>
                    <IconButton
                      onClick={() => handleDeleteOpen(leave.id)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1,
          py: 1.5,
          borderTop: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Pagination
          count={Math.ceil(sorted.length / rowsPerPage)}
          page={page + 1}
          onChange={(e, value) => setPage(value - 1)}
          shape="rounded"
          color="primary"
          size="small"
          sx={{
            "& .MuiPaginationItem-root": {
              borderRadius: "100%",
              height: 32,
            },
          }}
        />
      </Box>

      {/* Delete dialog */}
      <Dialog open={openDelete} onClose={handleDeleteClose}>
        <DialogTitle>Delete Leave</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this leave?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LeaveHistoryTable;
