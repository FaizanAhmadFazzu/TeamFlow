export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "member";
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}