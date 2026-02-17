import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { getWeekOffs } from "../../services/api/holiday.api";

export default function CalendarLogic(externalHolidays, year) {
  const [holidays, setHolidays] = useState([]);
  const [weekOffs, setWeekOffs] = useState({});
  const [loading, setLoading] = useState(true);

  // Only fetch week offs
  useEffect(() => {
    getWeekOffs()
      .then(setWeekOffs)
      .catch(console.error);
  }, []);

  // Use only external holidays (from Planner)
  useEffect(() => {
    setLoading(true);

    if (Array.isArray(externalHolidays)) {
      setHolidays(externalHolidays);
    } else {
      setHolidays([]);
    }

    setLoading(false);
  }, [externalHolidays, year]);

  const sortedHolidays = useMemo(
    () =>
      holidays
        .map((h) => ({
          ...h,
          day: dayjs(h.date),
        }))
        .sort((a, b) => a.day.valueOf() - b.day.valueOf()),
    [holidays]
  );

  const jumpToHoliday = (dir, baseDate) => {
    const current = dayjs(baseDate);

    const list =
      dir === "next"
        ? sortedHolidays
        : [...sortedHolidays].reverse();

    const target = list.find((h) =>
      dir === "next"
        ? h.day.isAfter(current)
        : h.day.isBefore(current)
    );

    return target?.day || null;
  };

  return {
    holidays,
    weekOffs,
    loading,
    jumpToHoliday,
  };
}
