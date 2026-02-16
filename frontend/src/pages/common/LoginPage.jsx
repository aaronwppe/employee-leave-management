import { useState, useEffect } from "react";
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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../../assets/logo.png";
import useAuth from "../../context/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      let page = "/employee";
      if (user?.role === "ADMIN") {
        page = "/admin";
      }

      const from = location.state?.from?.pathname || page;
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validateForm = () => {
    if (!email) {
      setFieldErrors((prev) => {
        return {
          ...prev,
          email: "Email is required",
        };
      });
    }

    if (!password) {
      setFieldErrors((prev) => {
        return {
          ...prev,
          password: "Password is required",
        };
      });
    }

    if (!email || !password) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldErrors((prev) => {
        return {
          ...prev,
          email: "Invalid email address",
        };
      });
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const account = await login(email, password);
      if (!account) {
        setApiError("Invalid credentials.");
      } else {
        setApiError("");
      }

      setSuccess(!account);
    } catch (err) {
      console.log(err);
      setApiError("Unexpected error. Please try again later.");
      setSuccess(false);
    }
    setOpenSnackbar(true);
    setLoading(false);
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
            onChange={(e) => {
              setFieldErrors((prev) => {
                return {
                  ...prev,
                  email: "",
                };
              });
              setEmail(e.target.value);
            }}
            error={Boolean(fieldErrors.email)}
            helperText={fieldErrors.email}
          />

          <TextField
            label="Password *"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => {
              setFieldErrors((prev) => {
                return {
                  ...prev,
                  password: "",
                };
              });
              setPassword(e.target.value);
            }}
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
            slotProps={{
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
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Login"
              )}
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
            severity={success ? "error" : "success"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {success ? apiError : "Login successful!"}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}
