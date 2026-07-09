import axios from "axios";

export interface RegisterPayload {
  nombre: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  nombre: string;
  email: string;
}

export interface UserOut {
  id: string;
  nombre: string;
  email: string;
}

export const registerUser = (payload: RegisterPayload): Promise<UserOut> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return axios
    .post(`${apiUrl}/api/v1/users/register`, payload)
    .then((response) => response.data);
};

export const loginUser = (payload: LoginPayload): Promise<LoginResponse> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return axios
    .post(`${apiUrl}/api/v1/users/login`, payload)
    .then((response) => response.data);
};
