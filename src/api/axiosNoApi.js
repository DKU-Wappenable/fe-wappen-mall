// src/api/axiosNoApi.js
import axios from "axios";

const axiosNoApi = axios.create({
  baseURL: "http://localhost:8080", //  /api 빠짐
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosNoApi;
