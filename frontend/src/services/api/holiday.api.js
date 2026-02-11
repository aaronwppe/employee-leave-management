import AxiosInstance from "./Axios";

// GET /api/holiday?year=YYYY
export const getHolidays = async (year) => {
  const res = await AxiosInstance.get(`holiday`, {
    params: { year },
  });
  return res.data.data.holidays;
};

// POST /api/holiday
export const addHoliday = async (payload) => {
  const res = await AxiosInstance.post("holiday", payload);
  return res.data;
};

// DELETE /api/holiday/{id}
export const deleteHoliday = async (id) => {
  const res = await AxiosInstance.delete(`holiday/${id}`);
  return res.data;
};
