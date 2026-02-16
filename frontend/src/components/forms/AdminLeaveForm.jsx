import { useState, useEffect } from "react";
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

function AdminLeaveForm({ employee, onClose }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
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

  useEffect(() => {
    if (employee) {
      setFormData((prev) => ({
        ...prev,
        first_name: employee.first_name,
        last_name: employee.last_name
      }));
    }
  }, [employee]);

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

  const handleSubmit = () => {
    if (!validateForm()) return;

    console.log("Admin applying leave for:", employee.id);

    setAlert({
      open: true,
      severity: "success",
      message: "Leave applied successfully!"
    });

    if (onClose) onClose();
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
          width: { xs: "90%", sm: 450 },
          p: 3,
          borderRadius: 3,
          position: "relative"
        }}
      >
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

        <Typography variant="h5" align="center" sx={{ mb: 2, color: "primary.main" }}>
          Apply Leave
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>

          <TextField
            label="First Name"
            name="first_name"
            value={formData.first_name}
            disabled
            fullWidth
          />

          <TextField
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            disabled
            fullWidth
          />

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
            <Button
              variant="contained"
              color="primary"
              sx={{ px: 3, fontWeight: 600 }}
              onClick={handleSubmit}
            >
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

export default AdminLeaveForm;
