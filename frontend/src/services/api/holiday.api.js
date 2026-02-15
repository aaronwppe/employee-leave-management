import api from "./client";

// GET /api/holiday?year=YYYY
export const getHolidays = async (year) => {
  const res = await api.get(`holiday`, {
    params: { year },
  });
  return res.data.data.holidays;
};

// POST /api/holiday
export const addHoliday = async (payload) => {
  const res = await api.post("holiday", payload);
  return res.data;
};

// DELETE /api/holiday/{id}
export const deleteHoliday = async (id) => {
  const res = await api.delete(`holiday/${id}`);
  return res.data;
};
