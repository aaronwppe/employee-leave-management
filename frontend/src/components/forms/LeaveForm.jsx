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
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { addLeave } from "../../services/api/leave.api";
import Calendar from "../common/Calendar";

export default function LeaveForm({
  onClose,
  onLeaveCreated,
  accountId = null,
}) {
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    reason: "",
    account_id: accountId,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => {
        return { ...prev, [e.target.name]: undefined };
      });
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
      newErrors.reason = "Reason must be at least 3 characters.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setAlert({
        open: true,
        severity: "error",
        message: "Please fix the highlighted fields.",
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

      setAlert({
        open: true,
        severity: "success",
        message: "Leave applied successfully.",
      });

      if (onLeaveCreated) {
        await onLeaveCreated();
      }
      onClose();
    } catch (error) {
      setLoading(false);

      const apiMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "";

      const msg = apiMessage.toLowerCase();

      let friendly = "Unable to apply leave. Please try again.";

      if (
        msg.includes("overlap") ||
        msg.includes("overlapping") ||
        msg.includes("conflict")
      ) {
        friendly =
          "You already have a leave scheduled for these dates. Please choose different dates.";
      } else if (msg.includes("already") || msg.includes("exists")) {
        friendly = "A leave already exists for the selected dates.";
      } else if (msg.includes("remaining")) {
        friendly = "You do not have enough leave balance.";
      } else if (apiMessage) {
        friendly = apiMessage;
      }

      setAlert({
        open: true,
        severity: "error",
        message: friendly,
      });
    }
  };

  return (
    <>
      {/* Overlay */}
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
        <Box
          sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Form */}
          <Paper
            elevation={6}
            sx={{
              width: 420,
              p: 3,
              borderRadius: 3,
              position: "relative",
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{ position: "absolute", top: 10, right: 10 }}
            >
              <CloseIcon />
            </IconButton>

            <Typography
              variant="h5"
              align="center"
              sx={{ mb: 2, color: "primary.main" }}
            >
              Apply Leave
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Start Date */}
              <TextField
                label="Start Date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                error={!!errors.start_date}
                helperText={errors.start_date}
                fullWidth
                disabled={loading}
                placeholder="YYYY-MM-DD"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setActiveField("start_date");
                          setCalendarOpen(true);
                        }}
                      >
                        <CalendarTodayIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* End Date */}
              <TextField
                label="End Date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                error={!!errors.end_date}
                helperText={errors.end_date}
                fullWidth
                disabled={loading}
                placeholder="YYYY-MM-DD"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setActiveField("end_date");
                          setCalendarOpen(true);
                        }}
                      >
                        <CalendarTodayIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Reason */}
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

          {/* Calendar */}
          {calendarOpen && (
            <Box sx={{ width: 380 }}>
              <Calendar
                selectedDate={formData[activeField]}
                year={new Date().getFullYear()}
                holidays={[]}
                disabled={false}
                onDateSelect={(date) => {
                  setFormData((prev) => ({
                    ...prev,
                    [activeField]: date,
                  }));

                  // Clear error for that field
                  setErrors((prev) => ({
                    ...prev,
                    [activeField]: undefined,
                  }));

                  setCalendarOpen(false);
                }}

              />
            </Box>
          )}
        </Box>
      </Box>

      {/* Popup message */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alert.severity} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}
