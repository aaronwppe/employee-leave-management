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
              bgcolor: dateError ? "error.light"  : "transparent",
              color: "error.main",
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
    </Stack>
  );
}

export default HolidayForm;
