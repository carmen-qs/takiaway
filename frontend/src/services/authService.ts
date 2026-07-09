import axios from "axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const login = (payload: LoginPayload): Promise<LoginResponse> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return axios
    .post(`${apiUrl}/api/v1/auth/login`, payload)
    .then((response) => response.data);
};
