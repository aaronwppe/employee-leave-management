import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

// // Attach token automatically
// AxiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Handle 401 globally
// AxiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       console.warn("Unauthorized. Redirect to login.");
//       // window.location.href = "/";
//     }
//     return Promise.reject(error);
//   }
// );

export default AxiosInstance;
