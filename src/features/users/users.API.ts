import axiosInstance from "../../services/axios";
import type { User } from "./users.types";
const token = localStorage.getItem("token");
export const getUsersRequest = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
};

export const getUserByIdRequest = async (id: string) => {
  const res = await axiosInstance.get(`/users/${id}`);

  return res.data;
};

export const createUserRequest = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await axiosInstance.post("/users", data);
  return res.data;
};
type FormData = {
  name?: string;
  email?: string;
  avatar?: File | null;
  bio?: string;
};
export const updateUserRequest = async (data: FormData) => {
  const res = await axiosInstance.patch(`/users`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export const updateUserAvatarRequest = async (
  id: string,
  data: Partial<User>
) => {
  const res = await axiosInstance.patch(`/users/${id}`, data);
  return res.data;
};

export const deleteUserRequest = async (id: string) => {
  const res = await axiosInstance.delete(`/users/${id}`);
  return res.data;
};
