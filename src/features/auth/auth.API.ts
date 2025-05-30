import type { LoginCredentials, SignupData } from "./auth.types";
import axiosInstance from "../../services/axios";
const API_URL = "/auth";

export const loginRequest = async (data: LoginCredentials) => {
  const response = await axiosInstance.post(`${API_URL}/login`, data);
  return response.data;
};

export const signupRequest = async (data: SignupData) => {
  const response = await axiosInstance.post(`${API_URL}/signup`, data);
  return response.data;
};
export const verifyTokenRequest = async (token: string) => {
  const response = await axiosInstance.post(`${API_URL}/me`, {
    token: `Bearer ${token}`,
  });
  return response.data;
};
