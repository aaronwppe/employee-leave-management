import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Switch,
  Stack,
  Chip,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  Tooltip,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Edit as EditIcon } from "@mui/icons-material";
import { MaterialReactTable } from "material-react-table";

import {
  getAccounts,
  toggleStatus,
} from "../../services/api/account.api";
import { getLeaves } from "../../services/api/leave.api";

import EmployeeCreateForm from "../../components/forms/EmployeeCreateForm";
import EmployeeEditForm from "../../components/forms/EmployeeEditForm";
import AdminLeaveDialog from "./AdminLeaveDialog";

import "../../App.css";

const EmployeeTable = () => {
  const [showOnboard, setShowOnboard] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editRow, setEditRow] = useState();
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [account, setAccount] = useState([]);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedRow, setSelectedRow] = useState(null);

  // Leave dialog state
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [leaveLoading, setLeaveLoading] = useState(false);

  // fetch accounts
  const fetchAccounts = async () => {
    setIsSaving(true);
    try {
      const data = await getAccounts();
      setAccount(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle status change
  const handleStatusChange = async () => {
    if (!selectedRow) return;
    setLoading(true);
    try {
      await toggleStatus(selectedRow.id, selectedRow.status);
      await fetchAccounts();
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // create account popup handler
  const openOnaboard = () => setShowOnboard(true);
  const closeOnaboard = () => setShowOnboard(false);

  // fetch leaves
  const fetchLeaves = async (accountId) => {
    setLeaveLoading(true);
    try {
      const data = await getLeaves({ account_id: accountId });
      setLeaves(data || []);
    } catch (err) {
      console.error(err);
      setLeaves([]);
    } finally {
      setLeaveLoading(false);
    }
  };

  // eye icon click
  const handleViewLeaves = async (row) => {
    const employee = row.original;
    setCurrentEmployee(employee);
    setLeaveDialogOpen(true);
    await fetchLeaves(employee.id);
  };

  // table columns
  const columns = useMemo(
    () => [
      { accessorKey: "first_name", header: "First Name" },
      { accessorKey: "last_name", header: "Last Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "allocated_leaves", header: "Allocated Leaves" },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) =>
          cell.getValue() ? (
            <Chip label="Active" color="success" variant="filled" />
          ) : (
            <Chip label="Inactive" color="error" variant="outlined" />
          ),
        Edit: ({ cell, row }) => {
          const [checked, setChecked] = React.useState(cell.getValue());

          return (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Inactive</Typography>
              <Switch
                checked={checked}
                onChange={(e) => {
                  setChecked(e.target.checked);
                  row._valuesCache.status = e.target.checked;
                }}
                color="success"
              />
              <Typography>Active</Typography>
            </Stack>
          );
        },
      },
    ],
    []
  );

  return (
    <div>
      <Box className={"TopBar"}>
        <CalendarViewMonthIcon />
        <Typography
          sx={{ marginLeft: "15px", fontWeight: "bold" }}
          variant="title2"
        >
          Employees
        </Typography>
      </Box>

      <MaterialReactTable
        columns={columns}
        data={account}
        enableRowActions
        enableEditing
        editingMode="modal"
        initialState={{
          pagination: { pageSize: 10, pageIndex: 0 },
          showGlobalFilter: true,
        }}
        muiPaginationProps={{
          rowsPerPageOptions: [5, 10, 15],
          variant: "outlined",
        }}
        paginationDisplayMode="pages"
        enableGlobalFilter
        positionGlobalFilter="left"
        muiSearchTextFieldProps={{
          size: "small",
          variant: "standard",
          placeholder: "Search employees...",
        }}
        enableTopToolbar
        enableToolbarInternalActions={false}
        state={{
          isLoading: isSaving,
        }}
        muiEditRowDialogProps={{
          disableEscapeKeyDown: isSaving,
        }}
        positionActionsColumn="last"
        renderTopToolbarCustomActions={() => (
          <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
            <Button color="primary" onClick={openOnaboard} variant="contained">
              + Create Account
            </Button>
          </Box>
        )}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
            <Tooltip title="Account Status" placement="top" arrow>
              <IconButton
                color="primary"
                onClick={() => {
                  setSelectedRow(row.original);
                  handleClickOpen();
                }}
              >
                {row.original.status ? (
                  <CancelIcon color="error" />
                ) : (
                  <CheckCircleIcon color="success" />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit" placement="top" arrow>
              <IconButton
                color="primary"
                onClick={() => {
                  setShowEditForm(true);
                  setEditRow(row.original);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Show Leave History" placement="top" arrow>
              <IconButton
                color="primary"
                onClick={() => handleViewLeaves(row)}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />

      {/* Status dialog */}
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
        <DialogTitle>Change Account Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure that you want to change the status?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            No
          </Button>
          <Button
            onClick={handleStatusChange}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Yes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Leave dialog */}
      <AdminLeaveDialog
        open={leaveDialogOpen}
        onClose={() => setLeaveDialogOpen(false)}
        leaves={leaves}
        loading={leaveLoading}
        employee={currentEmployee}
        onAddLeaveSuccess={() =>
          currentEmployee && fetchLeaves(currentEmployee.id)
        }
      />

      {/* Employee onboarding popup */}
      {showOnboard && (
        <EmployeeCreateForm
          onClose={closeOnaboard}
          onEmployeeCreated={fetchAccounts}
        />
      )}

      {showEditForm && (
        <EmployeeEditForm
          onClose={() => {
            setShowEditForm(false);
            fetchAccounts();
          }}
          row={editRow}
        />
      )}
    </div>
  );
};

export default EmployeeTable;
