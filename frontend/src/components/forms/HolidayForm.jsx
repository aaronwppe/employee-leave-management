import React from "react";
import { TextField, Button, Stack, Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function HolidayForm({
  selectedDate,
  setSelectedDate,
  holidayName,
  setHolidayName,
  onAdd,
  disabled,
  dateError,
  setDateError,
  nameError,
  setNameError,
}) {
  return (
    <Stack spacing={1.5} sx={{ pt: 1.9 }}>
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        {/* Date field */}
        <Stack spacing={0.5} sx={{ flex: 0.7 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={selectedDate ? dayjs(selectedDate) : null}
              onSelectedSectionsChange ={()=>setDateError("")}
              onChange={(newValue) => {
                const formatted = newValue ? newValue.format("YYYY-MM-DD") : "";
                setSelectedDate(formatted);
                
              }}
              format="YYYY-MM-DD"
              slots={{
                openPickerIcon: () => null, // hides calendar icon
              }}
              slotProps={{
                textField: {
                  size: "medium",
                  error: !!dateError,
                  InputLabelProps: { shrink: true },
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>

          
        </Stack>

        {/* Holiday name field */}
        <TextField
          label="Holiday Name"
          value={holidayName}
          onChange={(e) => {
            setHolidayName(e.target.value);
            setNameError("");
          }
          }
          onclose={()=>{setNameError("");}}
          disabled={disabled}
          error={!!nameError}
          size="medium"
          sx={{
            flex: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "background.paper",
            },
          }}
        />

        {/* Add button */}
        <Button
          variant="contained"
          color="primary"
          onClick={onAdd}
          disabled={disabled}
          sx={{
            height: 56,
            minWidth: 56,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 400,
            fontSize: "1rem",
            gap: 0.5,
          }}
        >
          <AddIcon fontSize="small" />
          Add
        </Button>
      </Stack>
      {/* Helper text (unchanged) */}
          <Box
            sx={{
              minHeight: 15,
              
              visibility: dateError || nameError ? "visible" : "hidden",
              bgcolor: "rgb(245, 207, 213)",
              p:1,
              borderRadius:"5px",
              width:"max-content",
              border:"1px solid red",
             
            }}
          >
            <Typography variant="caption" color="error" fontSize={"14px"}>
              {nameError || dateError|| "placeholder"}
              
            </Typography>
          </Box>
    </Stack>
  );
}

export default HolidayForm;
