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
import {createEmployee} from "../../services/api/account.api";

function EmployeeOnboard({ onEmployeeCreated, onClose }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    allocated_leaves: "",
    remaining_leaves: ""
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

    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";

    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";

    if (!formData.email.trim())
      newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter valid email";

    if (!formData.allocated_leaves)
      newErrors.allocated_leaves = "Allocated leaves required";

    if (!formData.remaining_leaves)
      newErrors.remaining_leaves = "Remaining leaves required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      allocated_leaves: "",
      remaining_leaves: ""
    });
    setErrors({});
  };

  const handleSubmit = async (type) => {
    if (!validateForm()) return;

    const isActive = type === "activate";

    try {
      const response = await createEmployee(formData, isActive);

      if (response.success) {
        setAlert({
          open: true,
          severity: "success",
          message:
            type === "activate"
              ? "Employee created and activated successfully"
              : "Employee created successfully"
        });

        resetForm();

        if (onEmployeeCreated) {
          await onEmployeeCreated(); // refresh table
        }

        onClose();
      }
    }catch (error) {
        setAlert({
          open: true,
          severity: "error",
          message: error?.message || "Error while creating employee"
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
          Onboard Employee
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

          <TextField
            label="Leaves for Current Year"
            name="remaining_leaves"
            type="number"
            value={formData.remaining_leaves}
            onChange={handleChange}
            error={!!errors.remaining_leaves}
            helperText={errors.remaining_leaves}
            fullWidth
          />

          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              onClick={() => handleSubmit("activate")}
            >
              Create & Activate
            </Button>

            <Button
              variant="contained"
              onClick={() => handleSubmit("create")}
            >
              Create
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
      </Snackbar>
    </Box>
  );
}

export default EmployeeOnboard;
