import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router";
import logo from "../../public/logo.png";

function Navbar({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#1976d2",
        boxShadow: 3
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer"
          }}
          onClick={() =>
            navigate(role === "admin" ? "/admin" : "/employee")
          }
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              height: "40px",
              width: "40px",
              objectFit: "contain"
            }}
          />
          
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>

          {role === "admin" && (
            <>
              <Button
                color="inherit"
                onClick={() => navigate("/admin")}
              >
                Home
              </Button>

              <Button
                color="inherit"
                onClick={() => navigate("/planner")}
              >
                Planner
              </Button>

              <Button
                color="inherit"
                onClick={() => navigate("/apply-leave")}
              >
                Leaves
              </Button>
            </>
          )}

          <Button
            variant="outlined"
            color="inherit"
            onClick={handleLogout}
            sx={{
              borderColor: "white",
              "&:hover": {
                borderColor: "#fff",
                backgroundColor: "rgba(255,255,255,0.1)"
              }
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
