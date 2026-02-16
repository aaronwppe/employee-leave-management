import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { addLeave } from "../../services/api/leave.api";

export default function LeaveForm({ onClose, onLeaveCreated }) {
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!formData.start_date) {
      newErrors.start_date = "Please select a start date.";
    } else if (formData.start_date < today) {
      newErrors.start_date = "Start date cannot be in the past.";
    }

    if (!formData.end_date) {
      newErrors.end_date = "Please select an end date.";
    }

    if (
      formData.start_date &&
      formData.end_date &&
      formData.start_date > formData.end_date
    ) {
      newErrors.end_date =
        "End date must be the same as or after the start date.";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Please enter a reason for your leave.";
    } else if (formData.reason.trim().length < 3) {
      newErrors.reason = "Reason should be at least 3 characters.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setAlert({
        open: true,
        severity: "error",
        message: "Please correct the highlighted fields.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      await addLeave(formData);
      if (onLeaveCreated) await onLeaveCreated();
      onClose();
    } catch (error) {
      setLoading(false);

      // Safely extract backend message
      let apiMessage = "";

      if (error.response?.data) {
        const data = error.response.data;

        if (typeof data === "string") {
          apiMessage = data;
        } else if (data.detail) {
          apiMessage = data.detail;
        } else if (data.message) {
          apiMessage = data.message;
        } else if (data.errors) {
          apiMessage = JSON.stringify(data.errors);
        } else {
          apiMessage = JSON.stringify(data);
        }
      }

      apiMessage = apiMessage.toLowerCase();

      let friendly = "Something went wrong. Please try again.";

      if (apiMessage.includes("overlap")) {
        friendly =
          "You already have a leave for these dates. Please choose different dates.";
      } else if (
        apiMessage.includes("already") ||
        apiMessage.includes("exists")
      ) {
        friendly =
          "This leave request already exists. Please select different dates.";
      } else if (apiMessage.includes("remaining")) {
        friendly =
          "You do not have enough remaining leave balance for these dates.";
      } else if (error.response?.status === 500) {
        friendly =
          "This leave overlaps with an existing one. Please choose different dates.";
      }

      setAlert({
        open: true,
        severity: "error",
        message: friendly,
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
        zIndex: 1400,
      }}
      onClick={onClose}
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: "90%", sm: 420 },
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 10, right: 10, color: "error.main" }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          Apply Leave
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Start Date"
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            error={!!errors.start_date}
            helperText={errors.start_date}
            slotProps={{ shrink: true }}
            fullWidth
            disabled={loading}
          />

          <TextField
            label="End Date"
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            error={!!errors.end_date}
            helperText={errors.end_date}
            InputLabelProps={{ shrink: true }}
            fullWidth
            disabled={loading}
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
            disabled={loading}
          />

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              sx={{ py: 1.25, px: 3, fontWeight: 600, minWidth: 140 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Apply Leave"
              )}
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
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </Box>
  );
}
