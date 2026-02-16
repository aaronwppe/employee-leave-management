import React from "react";
import { TextField, Button, Stack, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function HolidayForm({
  selectedDate,
  setSelectedDate,
  holidayName,
  setHolidayName,
  onAdd,
  disabled,
  dateError,
}) {
  return (
    <Stack spacing={1.5} sx={{ pt: 1.9 }}>
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        
        {/* Date field */}
        <Stack spacing={0.5} sx={{ flex: 0.7 }}>
          <TextField
            label="Date"
            type="date"
            value={selectedDate || ""}
            onChange={(e) => setSelectedDate(e.target.value)}
            size="medium"
            error={!!dateError}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#fafafa",
              },
              "& input[type='date']::-webkit-calendar-picker-indicator": {
                opacity: 0,
                display: "none",
              },
              "& input[type='date']": {
                MozAppearance: "textfield",
              },
            }}
          />

          {/* Helper text (unchanged) */}
          <Box
            sx={{
              bgcolor: dateError ? "#fdecea" : "transparent",
              color: "#d32f2f",
              px: 1.2,
              py: 0.6,
              borderRadius: 1,
              fontSize: "0.85rem",
              lineHeight: 1.4,
              minHeight: 32,
              display: "flex",
              alignItems: "center",
              visibility: dateError ? "visible" : "hidden",
            }}
          >
            {dateError || "placeholder"}
          </Box>
        </Stack>

        {/* Holiday name field */}
        <TextField
          label="Holiday Name"
          value={holidayName}
          onChange={(e) => setHolidayName(e.target.value)}
          disabled={disabled}
          size="medium"
          sx={{
            flex: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#fafafa",
            },
          }}
        />

        {/* Add button */}
        <Button
          variant="contained"
          onClick={onAdd}
          disabled={disabled}
          sx={{
            height: 56,
            minWidth: 56,
            borderRadius: 2,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            textTransform: "none",
            fontWeight: 400,     // increase weight
            fontSize: "1rem", // slightly larger text
            gap: 0.5,            // spacing between icon and text
          }}
        >
          <AddIcon fontSize="small" />
          Add
        </Button>
      </Stack>
    </Stack>
  );
}

export default HolidayForm;
