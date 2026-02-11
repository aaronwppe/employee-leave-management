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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../public/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const allowedUsers = [
    { email: "admin@example.com", password: "Admin123!" },
    { email: "user1@example.com", password: "User123!" },
    { email: "user2@example.com", password: "Pass123!" },
  ];

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    if (!email || !password) {
      setError("Both fields are required");
      setOpenSnackbar(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      setOpenSnackbar(true);
      return;
    }

    const user = allowedUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      setError("");
      setOpenSnackbar(true);
      alert(`Welcome ${email}! Login successful.`);
    } else {
      setError("Invalid credentials");
      setOpenSnackbar(true);
    }
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
        <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 3 }}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <img src={logo} alt="Logo" style={{ width: 120, height: "auto" }} />
          </Box>

          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>

          <TextField
            label="Email *"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(error)}
          />

          <TextField
            label="Password *"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            <Button variant="contained" sx={{ px: 4, py: 1 }} onClick={handleLogin}>
              Login
            </Button>
          </Box>
        </Paper>

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
            {error ? error : "Login successful!"}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default Login;
