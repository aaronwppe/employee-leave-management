import api from "./base.api";

async function createEmployee(formData, status) {
  try {
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      allocated_leaves: formData.allocated_leaves,
      leaves_for_current_year: formData.remaining_leaves,
      status: status,
      role: "EMPLOYEE",
    };

    const response = await api.post("/account/", payload);

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export default createEmployee;
