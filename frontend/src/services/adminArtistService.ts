import axios from "axios";

export interface VideoInput {
  youtube_video_id: string;
  titulo: string;
}

export interface ArtistInput {
  nombre_artistico: string;
  nombre_real?: string;
  origen: string;
  genero_musical: string;
  biografia: string;
  hito_relevante: string;
  fuente_url: string;
  foto_url?: string;
  videos: VideoInput[];
}

export interface ArtistOut extends ArtistInput {
  id: string;
}

const authHeader = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getArtists = (): Promise<ArtistOut[]> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return axios.get(`${apiUrl}/api/v1/artists`).then((r) => r.data);
};

export const createArtist = (token: string, payload: ArtistInput): Promise<ArtistOut> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return axios
    .post(`${apiUrl}/api/v1/admin/artists`, payload, authHeader(token))
    .then((r) => r.data);
};

export const updateArtist = (token: string, id: string, payload: ArtistInput): Promise<ArtistOut> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return axios
    .put(`${apiUrl}/api/v1/admin/artists/${id}`, payload, authHeader(token))
    .then((r) => r.data);
};

export const deleteArtist = (token: string, id: string): Promise<void> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return axios
    .delete(`${apiUrl}/api/v1/admin/artists/${id}`, authHeader(token))
    .then(() => undefined);
};
