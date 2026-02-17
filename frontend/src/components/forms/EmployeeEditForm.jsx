import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateAccount } from "../../services/api/account.api";

export default function EmployeeEditForm({ onClose, row }) {
  const [formData, setFormData] = useState({
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    allocated_leaves: row.allocated_leaves,
    status: row.status,
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [loading, setLoading] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter valid email";
    }

    if (!formData.allocated_leaves) {
      newErrors.allocated_leaves = "Allocated leaves required";
    } else if (
      formData.allocated_leaves < 0 ||
      formData.allocated_leaves > 365
    ) {
      newErrors.allocated_leaves =
        "Allocated leaves should be in range between 0 and 365";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveRow = async () => {
    try {
      setLoading(true);
      const id = row.id;
      await updateAccount({
        id: id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        allocated_leaves: formData.allocated_leaves,
        status: formData.status,
      });
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      setAlert({
        open: true,
        severity: "error",
        message: "Encountered an error. Please try again later.",
      });
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    validateForm();
    handleSaveRow(formData, row);
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
    >
      <Paper
        elevation={6}
        sx={{
          width: 420,
          p: 3,
          borderRadius: 3,
          position: "relative",
        }}
      >
        {/* Close icon */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "error.main",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          Edit Employee
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            error={!!errors.first_name}
            helperText={errors.first_name}
            fullWidth
          />

          <TextField
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            error={!!errors.last_name}
            helperText={errors.last_name}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />

          <TextField
            label="Allocated Leaves"
            name="allocated_leaves"
            type="number"
            value={formData.allocated_leaves}
            onChange={handleChange}
            error={!!errors.allocated_leaves}
            helperText={errors.allocated_leaves}
            fullWidth
          />

          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={() => handleSubmit("create")}
              // disabled={loadingType !== null}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Save"
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
      ></Snackbar>
    </Box>
  );
}
