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
} from "@mui/material";

import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import DeleteIcon from "@mui/icons-material/Delete";

function HolidayTable({
  holidays,
  onDelete,
  canEdit,
  onSelectDate,
  loading,
  year,
}) {
  // Pagination state
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  // Sort holidays by date
  const sorted = useMemo(() => {
    return [...holidays].sort(
      (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
    );
  }, [holidays]);

  if (loading) {
    return (
      <Box mt={2} textAlign="center">
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!holidays.length) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: "center" }}
      >
        No holidays set for {year} yet.
      </Typography>
    );
  }

  return (
    <Box mt={2}>
      {/* Top Heading Bar */}
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
          Organization Holiday
        </Typography>
      </Box>

      <Typography
        variant="subtitle2"
        sx={{
          mb: 1,
          fontWeight: 600,
        }}
      >
        Total holidays: {holidays.length}
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
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell width={50}></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sorted
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((h) => (
                <TableRow
                  key={h.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.03)",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      cursor: "pointer",
                      color: "primary.main",
                    }}
                    onClick={() => onSelectDate?.(h.date)}
                  >
                    {h.date}
                  </TableCell>

                  <TableCell>{h.name}</TableCell>

                  <TableCell>
                    {canEdit && (
                      <IconButton
                        onClick={() => onDelete(h.id)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Rounded Pagination (right aligned) */}
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

    </Box>
  );
}

export default HolidayTable;
