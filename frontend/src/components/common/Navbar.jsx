import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import useAuth from "../../context/useAuth";

function Navbar({ role = "EMPLPOYEE" }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isAdmin = role === "ADMIN";

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#1976d2",
        boxShadow: 3,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate(isAdmin ? "/admin" : "/leaves")}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              height: "40px",
              width: "40px",
              objectFit: "contain",
            }}
          />
        </Box>

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

              <Button color="inherit" onClick={() => navigate("/admin/leaves")}>
                My Leaves
              </Button>
            </>
          )}

          <Button
            variant="outlined"
            color="inherit"
            onClick={logout}
            sx={{
              borderColor: "white",
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
  );
}

export default Navbar;
