import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { applyLeave } from "../../services/api/leave.api";

function LeaveForm({ onLeaveCreated, onClose }) {
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    reason: ""
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.start_date)
      newErrors.start_date = "Start date is required";

    if (!formData.end_date)
      newErrors.end_date = "End date is required";

    if (
      formData.start_date &&
      formData.end_date &&
      formData.start_date > formData.end_date
    ) {
      newErrors.end_date = "End date cannot be before start date";
    }

    if (!formData.reason.trim())
      newErrors.reason = "Reason is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      start_date: "",
      end_date: "",
      reason: ""
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await applyLeave(formData);

      setAlert({
        open: true,
        severity: "success",
        message: "Leave applied successfully"
      });

      resetForm();

      if (onLeaveCreated) {
        await onLeaveCreated(); // refresh leave list
      }

      onClose(); // close modal
    } catch (error) {
      setAlert({
        open: true,
        severity: "error",
        message:
          error?.error ||
          error?.response?.data?.error ||
          "Error while applying leave"
      });
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1400
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 420,
          p: 3,
          borderRadius: 3,
          position: "relative"
        }}
      >
        {/* Close icon */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "error.main"
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          Apply Leave
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            error={!!errors.start_date}
            helperText={errors.start_date}
            fullWidth
          />

          <TextField
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            error={!!errors.end_date}
            helperText={errors.end_date}
            fullWidth
          />

          <TextField
            label="Reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            error={!!errors.reason}
            helperText={errors.reason}
            multiline
            rows={3}
            fullWidth
          />

          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleSubmit}>
              Apply Leave
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default LeaveForm;