import axios from "axios";

export interface ContactMessageOut {
  id: string;
  nombre: string;
  email: string;
  mensaje: string;
  tipo: string;
  fecha_creacion: string;
}

export const getContactMessages = (
  token: string
): Promise<ContactMessageOut[]> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return axios
    .get(`${apiUrl}/api/v1/contact-messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

export const deleteContactMessage = (
  token: string,
  id: string
): Promise<void> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return axios
    .delete(`${apiUrl}/api/v1/contact-messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => undefined);
};
