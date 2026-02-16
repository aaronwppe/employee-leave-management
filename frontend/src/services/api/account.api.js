import api from "./client";

// Create new employee
export const createEmployee = async (formData, status) => {
  const payload = {
    first_name: formData.first_name,
    last_name: formData.last_name,
    email: formData.email,
    allocated_leaves: formData.allocated_leaves,
    leaves_for_current_year: formData.remaining_leaves,
    status: status,
    role: "EMPLOYEE",
  };

  const res = await api.post("/account/", payload);
  return res.data;
};

// Get all accounts
export const getAccounts = async () => {
  const res = await api.get("/account/");
  return res.data.data.accounts;
};

// Toggle account status
export const toggleStatus = async (id, currentStatus) => {
  const res = await api.patch(`/account/${id}/`, {
    status: !currentStatus,
  });
  return res.data;
};

// Update account
export const updateAccount = async ({
  id,
  first_name,
  last_name,
  email,
  allocated_leaves,
  status,
  role = "EMPLOYEE",
}) => {
  console.log(id, first_name, last_name, email, allocated_leaves, status, role);
  const res = await api.put(`/account/${id}/`, {
    first_name,
    last_name,
    email,
    allocated_leaves,
    status,
    role,
  });
  return res.data.data.success;
};

// Get single account by ID
export const getAccountById = async (id) => {
  const res = await api.get(`/account/${id}/`);
  return res.data.data;
};
