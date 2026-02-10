import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert
} from "@mui/material";
import "./EmployeeForm.css" 

import createEmployee from "../../services/api/account.api";

function EmployeeOnboard({ onEmployeeCreated }) {

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
          onEmployeeCreated(response.data);
        }
      }
    } catch (error) {
      setAlert({
        open: true,
        severity: "error",
        message: error?.message || "Error while creating employee"
      });
    }
  };

  return (
    <Paper className="onboard-container" elevation={3}>
      <Typography variant="h5" align="center">
        Onboard Employee
      </Typography>

      <Box className="form-container">

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

        <Box className="btn-group">
          <Button
            variant="contained"
            color="success"
            onClick={() => handleSubmit("activate")}
          >
            Create & Activate
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSubmit("create")}
          >
            Create
          </Button>
        </Box>
      </Box>

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
    </Paper>
  );
}

export default EmployeeOnboard;
