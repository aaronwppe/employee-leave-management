import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import useAuth from "../../context/useAuth";

function Navbar({ role = "EMPLOYEE" }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isAdmin = role === "ADMIN";

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  return (
    <Box
      sx={{
        backgroundColor: "#f5f6fa",
        py: 2,
      }}
    >
      <Container sx={{ maxWidth: "80%", minWidth: "80%" }}>
        <AppBar
          position="static"
          color="primary"
          sx={{
            boxShadow: 3,
            borderRadius: 3,
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              minHeight: "56px",
              px: 3,
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
              onClick={() => navigate(isAdmin ? "/admin" : "/employee")}
            >
              <img
                src={logo}
                alt="Logo"
                style={{
                  height: "66px",
                  width: "76px",
                  objectFit: "contain",
                }}
              />
            </Box>

            {/* Menu */}
            <Box sx={{ display: "flex", gap: 2 }}>
              {isAdmin && (
                <>
                  <Button color="inherit" onClick={() => navigate("/admin")}>
                    Home
                  </Button>

                  <Button
                    color="inherit"
                    onClick={() => navigate("/admin/planner")}
                  >
                    Planner
                  </Button>

                  <Button
                    color="inherit"
                    onClick={() => navigate("/admin/leaves")}
                  >
                    My Leaves
                  </Button>
                </>
              )}

              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setOpenLogoutDialog(true)}
                sx={{
                  borderColor: "white",
                  borderRadius: 2,
                  px: 2.5,
                  "&:hover": {
                    borderColor: "#fff",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Logout Confirmation Dialog */}
        <Dialog
          open={openLogoutDialog}
          onClose={() => setOpenLogoutDialog(false)}
        >
          <DialogTitle>Confirm Logout</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Are you sure you want to logout?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => setOpenLogoutDialog(false)}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>

            <Button
              onClick={() => {
                setOpenLogoutDialog(false);
                logout();
              }}
              variant="contained"
              color="primary"
            >
              Yes, Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default Navbar;
