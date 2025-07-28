import axios from 'axios';

const API = axios.create({
  // baseURL: 'http://localhost:3009/api',
  baseURL : "https://chargingstation-backend-td8a.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
