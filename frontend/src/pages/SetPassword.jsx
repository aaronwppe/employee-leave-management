import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert
} from "@mui/material";
import { Visibility, VisibilityOff, CheckCircle } from "@mui/icons-material";
import logo from "../public/logo.png";

function SetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Password conditions
  const conditions = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[@$!%*?&]/.test(newPassword)
  };

  const validatePassword = (password) => {
    return Object.values(conditions).every(Boolean);
  };

  const handleSubmit = () => {
    if (!newPassword || !confirmPassword) {
      setError("Both fields are required");
      setOpenSnackbar(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setOpenSnackbar(true);
      return;
    }

    if (!validatePassword(newPassword)) {
      setError("Password does not meet all requirements");
      setOpenSnackbar(true);
      return;
    }

    setError("");
    setOpenSnackbar(true);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {/* Logo */}
        

        {/* Paper Form */}
        <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 3 }}>
            <Box sx={{ mb: 4, textAlign: "center" }}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: 120, height: "auto" }}
          />
        </Box>
          <Typography variant="h5" align="center" gutterBottom>
            Set New Password
          </Typography>

          <TextField
            label="New Password *"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={Boolean(error)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Password Conditions */}
          <Box sx={{ mb: 2, mt: 1 }}>
            {Object.entries(conditions).map(([key, valid]) => {
              let text = "";
              switch (key) {
                case "length":
                  text = "At least 8 characters";
                  break;
                case "uppercase":
                  text = "At least 1 uppercase letter";
                  break;
                case "lowercase":
                  text = "At least 1 lowercase letter";
                  break;
                case "number":
                  text = "At least 1 number";
                  break;
                case "special":
                  text = "At least 1 special character (@$!%*?&)";
                  break;
                default:
                  break;
              }
              return (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: valid ? "green" : "gray",
                    fontSize: "0.875rem",
                    mb: 0.5
                  }}
                >
                  <CheckCircle fontSize="small" />
                  <Typography sx={{ ml: 1 }}>{text}</Typography>
                </Box>
              );
            })}
          </Box>

          <TextField
            label="Confirm Password *"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={Boolean(error)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" sx={{ px: 4, py: 1 }} onClick={handleSubmit}>
              Confirm
            </Button>
          </Box>
        </Paper>

        {/* Snackbar Popup */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={error ? "error" : "success"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {error ? error : "Password set successfully!"}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default SetPassword;
