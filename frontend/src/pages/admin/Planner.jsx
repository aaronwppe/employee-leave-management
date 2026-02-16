import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  Box,
  Typography,
  Grid,
  Alert,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

import Calendar from "../../components/common/Calendar";
import HolidayForm from "../../components/forms/HolidayForm";
import HolidayTable from "../../components/tables/HolidayTable";

import {
  getHolidays,
  addHoliday,
  deleteHoliday,
} from "../../services/api/holiday.api";

function Planner() {
  const currentYear = new Date().getFullYear();

  const [reload, setReload] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentYear + 1);
  const [holidays, setHolidays] = useState([]);

  // Form state
  const [selectedDate, setSelectedDate] = useState("");
  const [holidayName, setHolidayName] = useState("");

  // Calendar-only state
  const [calendarDate, setCalendarDate] = useState(
    dayjs().year(currentYear + 1).startOf("year").format("YYYY-MM-DD")
  );

  const [dateError, setDateError] = useState("");
  const [loading, setLoading] = useState(false);

  const canEdit = selectedYear > currentYear;

  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      try {
        const data = await getHolidays(selectedYear);
        setHolidays(data);
      } catch (err) {
        console.error("Error loading holidays", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, [selectedYear, reload]);

  const handleAdd = async () => {
    if (!selectedDate || !holidayName) return;

    try {
      await addHoliday({
        name: holidayName,
        date: selectedDate,
      });
      setHolidayName("");
      setSelectedDate("");
      setReload((prev) => !prev);
    } catch (err) {
      alert(err.error || "Error adding holiday");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHoliday(id);
      setReload((prev) => !prev);
    } catch (err) {
      alert(err.error || "Error deleting holiday");
    }
  };

  // Calendar click (affects form + calendar)
  const handleDateSelect = (date) => {
    const day = new Date(date).getDay();

    if (day === 0 || day === 6) {
      setDateError("Weekends cannot be selected as holidays.");
      setSelectedDate("");
      return;
    }

    const exists = holidays.some((h) => h.date === date);
    if (exists) {
      setDateError("This date is already marked as a holiday.");
      setSelectedDate("");
      return;
    }

    setDateError("");
    setSelectedDate(date);      // form
    setCalendarDate(date);      // calendar
    setSelectedYear(new Date(date).getFullYear());
  };

  // Table click (calendar only)
  const handleTableDateSelect = (date) => {
    setCalendarDate(date);
    setSelectedYear(new Date(date).getFullYear());
  };

  return (
    <Box sx={{ p: 3 }}>
      
      {!canEdit && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Holidays can only be edited for future years.
        </Alert>
      )}

      <Grid container spacing={10} alignItems="flex-start">
        {/* Calendar */}
        <Grid size={{ xs: 15, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, height: 550 }}>
            <CardContent>
              <Calendar
                holidays={holidays}
                year={selectedYear}
                onDateSelect={handleDateSelect}
                onCalendarJump={(date) => {
                  setCalendarDate(date);     // only move calendar
                  setSelectedYear(new Date(date).getFullYear());
                }}
                onYearChange={setSelectedYear}
                disabled={!canEdit}
                selectedDate={calendarDate}
              />
            </CardContent>
          </Card>
        </Grid>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* Form + table */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, height: 550 }}>
              <CardContent>
                <Stack spacing={3}>
                  <HolidayForm
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    holidayName={holidayName}
                    setHolidayName={setHolidayName}
                    onAdd={handleAdd}
                    disabled={!canEdit}
                    dateError={dateError}
                  />

                  <HolidayTable
                    holidays={holidays}
                    onDelete={handleDelete}
                    canEdit={canEdit}
                    onSelectDate={handleTableDateSelect}
                    loading={loading}
                    year={selectedYear}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </LocalizationProvider>
      </Grid>
    </Box>
  );
}

export default Planner;
