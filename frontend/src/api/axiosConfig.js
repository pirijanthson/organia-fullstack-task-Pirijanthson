import axios from "axios";

const Api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:8080/TMS",
  headers: {
    "Content-Type": "application/json",
  },
});

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) { 
    config.headers.Authorization = `Bearer ${token}`;
  }
    return config;
}, (error) => {
  return Promise.reject(error);
});

export default Api;