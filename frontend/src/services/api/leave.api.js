import api from "./client";

export const getLeaves = async ({ year = null, account_id = null }) => {
  let params = {};

  if (year) {
    params["year"] = year;
  }
  if (account_id) {
    params["account_id"] = account_id;
  }

  const res = await api.get("/leave/", {
    params,
  });

  return res.data.data.leaves;
};

export const addLeave = async ({
  start_date,
  end_date,
  reason,
  account_id = null,
}) => {
  let body = { start_date, end_date, reason };

  if (account_id) {
    body["account_id"] = account_id;
  }

  const res = await api.post(`/leave/`, body);
  return res.data.data;
};

export const deleteLeave = async (leaveId) => {
  await api.delete(`/leave/${leaveId}/`);
  return true;
};
