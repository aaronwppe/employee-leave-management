import AxiosInstance from "./Axios";

// Login
export const login = async (credentials) => {
  const res = await AxiosInstance.post("login", credentials);
  const token = res.data.token;

  if (token) {
    localStorage.setItem("token", token);
  }

  return res.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
};

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

  const res = await AxiosInstance.post("/account/", payload);
  return res.data;
};

// Get all accounts
export const getAccounts = async () => {
  const res = await AxiosInstance.get("/account/");
  return res.data.data.accounts;
};

// Toggle account status
export const toggleStatus = async (id, currentStatus) => {
  const res = await AxiosInstance.patch(`/account/${id}/`, {
    status: !currentStatus,
  });
  return res.data;
};

// Update account
export const updateAccount = async (id, data) => {
  const res = await AxiosInstance.put(`/account/${id}/`, data);
  return res.data.data.accounts;
};
