import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import {
  Paper,
  Box,
  CircularProgress,
  Button,
  Stack,
  Badge,
  Typography,Fade,
  IconButton,
  Chip,
} from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { DateCalendar, PickersDay } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import CalendarLogic from "../common/CalendarLogic";

function Calendar({
  onDateSelect,
  onCalendarJump,
  year,
  holidays,
  disabled,
  onYearChange,
  selectedDate,
}) {
  const [view, setView] = useState("day");

  const {
    holidays: logicHolidays,
    weekOffs,
    loading,
    jumpToHoliday,
  } = CalendarLogic(holidays, year);

  const calendarValue = selectedDate ? dayjs(selectedDate) : dayjs();

  const selectedHoliday = useMemo(() => {
    const selected = calendarValue.format("YYYY-MM-DD");
    return logicHolidays.find((h) => h.date === selected);
  }, [calendarValue, logicHolidays]);

  const CustomDay = (props) => {
    const { day, selected, ...other } = props;

    const holidayObj = logicHolidays.find(
      (h) => h.date === day.format("YYYY-MM-DD")
    );

    const isHoliday = !!holidayObj;
    const isWeekOff =
      weekOffs?.[day.format("dddd").toUpperCase()] === "ALL";
    const isToday = day.isSame(dayjs(), "day");

    return (
      <Badge
        overlap="circular"
        badgeContent={
          isHoliday ? (
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#d32f2f",
              }}
            />
          ) : null
        }
      >
        <PickersDay
          {...other}
          day={day}
          selected={selected}
          disabled={disabled}
          sx={{
            width: 42,
            height: 42,
            fontSize: "0.9rem",

            ...(selected && {
              background: "#1565c0",
              color: "#fff",
            }),

            ...(isHoliday && !selected && {
              background: "#ffebee",
              color: "#c62828",
            }),

            ...(isWeekOff &&
              !isHoliday &&
              !selected && {
                background: "#fff8e1",
                color: "#ef6c00",
              }),

            ...(isToday && {
              border: "2px solid #1565c0",
            }),
          }}
        />
      </Badge>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        px: 1,
        py: 1.5,
        borderRadius: 3,
      }}
    >

      {/* Calendar */}
      {loading ? (
        <CircularProgress size={28} sx={{ my: 4 }} />
      ) : (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={calendarValue}
            view={view}
            onViewChange={setView}
            views={["year", "month", "day"]}
            onChange={(newVal) => {
              onYearChange?.(newVal.year());
              onDateSelect?.(newVal.format("YYYY-MM-DD"));
            }}
            showDaysOutsideCurrentMonth
            slots={{ day: CustomDay }}
            sx={{
              width: "100%",
              maxWidth: 420,
              maxHeight:475,
              mx: "auto",
               // Remove internal scroll
              "& .MuiDayCalendar-root": {
                overflow: "visible",
              },
              // override root overflow
              "&.MuiDateCalendar-root": {
                overflow: "visible",
              },
              // Increase calendar body height
              "& .MuiDayCalendar-monthContainer": {
                minHeight: 360,   // increase as needed
              },
              "& .MuiDayCalendar-slideTransition": {
                 overflow:"visible",
                minHeight: 320,
              },
             
            }}
          />
        </LocalizationProvider>
      )}

      {/* Footer section */}
      <Stack
        spacing={2}
        mt={4}
        sx={{
          height: 135,          // fixed footer height
          justifyContent: "space-between",
          px: 2,
          py: 2,
          
        }}
      >
        {/* Selected holiday (fixed space + fade) */}
        <Box sx={{ height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Fade in={Boolean(selectedHoliday)} timeout={300}>
            <Typography
              variant="body2"
              sx={{
                position: "absolute" ,
                color: "primary.main",
                p:1,
              }}
              fontWeight={700}
              
            >
              
              {selectedHoliday
                ? `${selectedHoliday.date} – ${selectedHoliday.name}`
                : ""}
            </Typography>
          </Fade>
        </Box>

        {/* Legend */}
        <Stack direction="row" spacing={3} justifyContent="center">
          <Chip
            size="small-x"
            label="Holiday"
            sx={{ bgcolor: "#ffebee", color: "#c62828" }}
          />
          <Chip
            size="small-x"
            label="Weekend"
            sx={{
              bgcolor: "#fff8e1",
              color: "#ef6c00",
            }}
          />
          <Chip
            size="small-x"
            label="Today"
            variant="outlined"
            sx={{ borderColor: "#1565c0",}}
          />
        </Stack>

        {/* Footer navigation */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Left group */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              size="small"
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "&:hover": { bgcolor: "primary.dark" },
                borderRadius: "50%",
              }}
              onClick={() => {
                const target = jumpToHoliday("prev", calendarValue);
                if (target) onCalendarJump?.(target.format("YYYY-MM-DD"));
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <Typography variant="body2" fontWeight={700}>
              Holiday
            </Typography>

            <IconButton
              size="small"
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "&:hover": { bgcolor: "primary.dark" },
                borderRadius: "50%",
              }}
              onClick={() => {
                const target = jumpToHoliday("next", calendarValue);
                if (target) onCalendarJump?.(target.format("YYYY-MM-DD"));
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Stack>

          {/* Right side button */}
          <Button
            size="small-x"
            variant="contained"
            color="primary"
            startIcon={<TodayIcon />}
            onClick={() =>
              onDateSelect?.(dayjs().format("YYYY-MM-DD"))
            }
            sx={{
              fontWeight: 700,
              px: 3,
            }}
          >
            Today
          </Button>
        </Stack>
      </Stack>

    </Paper>
  );
}

export default Calendar;
