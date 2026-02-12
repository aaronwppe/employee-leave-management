import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Container
} from "@mui/material";
import Navbar from "../../components/common/Navbar";
import LeaveForm from "../../components/forms/LeaveForm";

function EmployeeHome() {
  const [openForm, setOpenForm] = useState(false);

  return (
    <>
      <Navbar role="employee" />

      <Container maxWidth="lg" sx={{ mt: 5 }}>

        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 4
          }}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: 3,
              px: 4,
              fontWeight: "bold"
            }}
            onClick={() => setOpenForm(true)}
          >
            Apply Leave
          </Button>
        </Box>

        {/* CARDS */}
        <Grid container spacing={4} justifyContent="center">

          {/* CARD 1 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: 200,
                width: "100%",
                borderRadius: 4,
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",

                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.15)"
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  Total Leaves
                </Typography>
                <Typography variant="h3" sx={{ mt: 2, fontWeight: "bold" }}>
                  20
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* CARD 2 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: 200,
                width: "100%",
                borderRadius: 4,
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",

                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.15)"
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  Remaining Leaves
                </Typography>
                <Typography variant="h3" sx={{ mt: 2, fontWeight: "bold" }}>
                  12
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* CARD 3 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: 200,
                width: "100%",
                borderRadius: 4,
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",

                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.15)"
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  Exhausted Leaves
                </Typography>
                <Typography variant="h3" sx={{ mt: 2, fontWeight: "bold" }}>
                  8
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>

      {openForm && (
        <LeaveForm onClose={() => setOpenForm(false)} />
      )}
    </>
  );
}

export default EmployeeHome;
