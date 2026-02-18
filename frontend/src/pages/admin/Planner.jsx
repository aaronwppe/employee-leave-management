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
  Snackbar,
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
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const canEdit = selectedYear > currentYear;

  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      try {
        const data = await getHolidays(selectedYear);
        // Correct array extraction
        setHolidays(Array.isArray(data) ? data : data?.holidays || []);
      } catch (err) {
        console.error("Error loading holidays", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, [selectedYear, reload]);

  useEffect(() => {
  setCalendarDate(
    dayjs()
      .year(selectedYear)
      .startOf("year")
      .format("YYYY-MM-DD")
  );
}, [selectedYear]);

  const handleAdd = async () => {
    setDateError("");
    setNameError("");
    if (!selectedDate && !holidayName.trim()) {
      setDateError("Date is required.");
      setNameError("Holiday name is required.");
      return;   
    }
    
    if (!selectedDate) {
      setDateError("Date is required.");
      return
    }

    if (!holidayName.trim()) {
      setNameError("Holiday name is required.");
      return
    }
    

    if (holidayName.trim().length > 40) {
      setNameError("Holiday name must be under 40 characters.");
      return;
    }

    const exists = holidays.some((h) => h.date === selectedDate);
    if (exists) {
      setDateError("This date is already marked as a holiday.");
      return;
    }

    try {
      await addHoliday({
        name: holidayName.trim(),
        date: selectedDate,
      });

      setHolidayName("");
      setSelectedDate("");
      setDateError("");
      setNameError("");
      setReload((prev) => !prev);
    } catch (err) {
      setDateError(err.error || "Error adding holiday");
    }
  };

  // Final delete handler
  const handleDelete = async (id) => {
    try {
      await deleteHoliday(id);
    } catch (err) {
      const message =
        err.response?.data?.detail || "Error deleting holiday";
      setErrorMsg(message);
    }

    // always remove from UI
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  };

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
    setSelectedDate(date);
    setCalendarDate(date);
    setSelectedYear(new Date(date).getFullYear());
  };

  const handleTableDateSelect = (date) => {
    setCalendarDate(date);
    setSelectedYear(new Date(date).getFullYear());
  };

  return (
    <Box sx={{ p: 1 }}>
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
                  setCalendarDate(date);
                  setSelectedYear(new Date(date).getFullYear());
                }}
                onYearChange={setSelectedYear}
                disabled={!canEdit}
                selectedDate={calendarDate}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Form + Table */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, height: 550 }}>
              <CardContent>
                <Stack spacing={1}>
                  <HolidayForm
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    holidayName={holidayName}
                    setHolidayName={setHolidayName}
                    onAdd={handleAdd}
                    disabled={!canEdit}
                    dateError={dateError}
                    setDateError={setDateError}
                    nameError={nameError}
                    setNameError={setNameError}

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

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMsg}
        autoHideDuration={3000}
        onClose={() => setErrorMsg("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setErrorMsg("")}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Planner;
