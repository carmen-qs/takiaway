import axios from "axios";

export interface ContactPayload {
  nombre: string;
  email: string;
  mensaje: string;
  tipo: string;
}

export interface ContactResponse {
  status: string;
  message: string;
}

export const sendContactMessage = (
  payload: ContactPayload
): Promise<ContactResponse> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return axios
    .post(`${apiUrl}/api/v1/contact-messages`, payload)
    .then((response) => response.data);
};
