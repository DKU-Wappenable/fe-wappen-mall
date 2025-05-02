import axiosInstance from "./axiosInstance";

export const login = async (email, password) => {
  const res = await axiosInstance.post("/login", { email, password });
  return res.data;
};

export const signup = async (signupData) => {
  const res = await axiosInstance.post("/signup", signupData);
  return res.data;
}; 