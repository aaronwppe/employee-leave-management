import React, { useMemo, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
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
import "../../App.css";

function LeaveHistoryTable({
  leaves = [],
  onDelete,
  loading,
  year,
  setYear,
}) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const [openDelete, setOpenDelete] = useState(false);
  const [leaveId, setLeaveId] = useState(null);

  const [search, setSearch] = useState("");

  // Filter leaves by reason
  const filtered = useMemo(() => {
    return leaves.filter((leave) =>
      leave.reason?.toLowerCase().includes(search.toLowerCase())
    );
  }, [leaves, search]);

  // Sort leaves
  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) => dayjs(a.start_date).valueOf() - dayjs(b.start_date).valueOf()
    );
  }, [filtered]);


  // Total leave days
  const totalLeaveDays = useMemo(() => {
    return filtered.reduce((sum, leave) => sum + (leave.total_days || 0), 0);
  }, [filtered]);

  const handleDeleteOpen = (id) => {
    setLeaveId(id);
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
    setLeaveId(null);
  };

  const handleDeleteConfirm = () => {
    if (leaveId) onDelete(leaveId);
    handleDeleteClose();
  };

  // Loading state
  if (loading) {
    return (
      <Box mt={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <Box
        className={"TopBar"}
        sx={{ display: "flex", alignItems: "center", mb: 2 }}
      >
        <CalendarViewMonthIcon sx={{ fontSize: 28 }} />
        <Typography sx={{ ml: 2, fontWeight: "bold", fontSize: "1.3rem" }}>
          Leave History
        </Typography>
      </Box>

      {/* Top control bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Left: total leave */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.15rem",
          }}
        >
          Total leave days: {totalLeaveDays}
        </Typography>

        {/* Right side controls */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            placeholder="Search by reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 220 }}
          />

          <TextField
            select
            size="small"
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            sx={{ width: 120 }}
          >
            {[0, 1, 2, 3, 4].map((i) => {
              const y = new Date().getFullYear() - i;
              return (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              );
            })}
          </TextField>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: 1 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
              <TableCell sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Start Date
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "1rem" }}>
                End Date
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Days
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Reason
              </TableCell>
              <TableCell width={60}></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No leaves taken in {year}.
                </TableCell>
              </TableRow>
            ) : (
              sorted
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((leave) => {
                  const isPastLeave =
                    dayjs(leave.start_date).isBefore(dayjs(), "day") ||
                    dayjs(leave.start_date).isSame(dayjs(), "day");

                  return (
                    <TableRow key={leave.id} hover>
                      <TableCell>
                        {dayjs(leave.start_date).format("YYYY-MM-DD")}
                      </TableCell>
                      <TableCell>
                        {dayjs(leave.end_date).format("YYYY-MM-DD")}
                      </TableCell>
                      <TableCell>{leave.total_days}</TableCell>
                      <TableCell>{leave.reason}</TableCell>
                      <TableCell>
                        <Tooltip
                          title={
                            isPastLeave
                              ? "Past leaves cannot be deleted"
                              : "Delete leave"
                          }
                        >
                          <span>
                            <IconButton
                              onClick={() => handleDeleteOpen(leave.id)}
                              size="small"
                              disabled={isPastLeave}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
            )}
          </TableBody>

        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "flex-end", py: 1.5 }}>
        <Pagination
          count={Math.ceil(sorted.length / rowsPerPage)}
          page={page + 1}
          onChange={(e, value) => setPage(value - 1)}
          shape="rounded"
          color="primary"
          size="small"
        />
      </Box>

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
