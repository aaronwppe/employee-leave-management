import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
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
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff, CheckCircle } from "@mui/icons-material";
import logo2 from "../../assets/logo2.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function SetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const accountId = searchParams.get("account_id");
  const token = searchParams.get("token");

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Password conditions
  const conditions = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[@$!%*?&]/.test(newPassword),
  };

  const validatePassword = () => {
    return Object.values(conditions).every(Boolean);
  };

  const handleSubmit = async () => {
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

    if (!validatePassword()) {
      setError("Password does not meet all requirements");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/auth/password-reset/confirm/`,
        {
          account_id: accountId,
          token: token,
          password: newPassword,
        }
      );

      setError("");
      setOpenSnackbar(true);

      // redirect after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.log(err);
      setError("Invalid or expired link");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 4, width: "100%", maxWidth: 350, borderRadius: 3 }}
        >
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <img src={logo2} alt="Logo" style={{ width: 120, height: "auto" }} />
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
              ),
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
                    mb: 0.5,
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
              ),
            }}
          />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              sx={{ px: 4, py: 1, minWidth: 120 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Confirm"
              )}
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

export default SetPasswordPage;
