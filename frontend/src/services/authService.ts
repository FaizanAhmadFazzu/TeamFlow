import api from "./api";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

export const registerUser = async (data: RegisterPayload) => {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    data
  );

  return response.data;
};

export const loginUser = async (data: LoginPayload) => {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    data
  );

  return response.data;
};