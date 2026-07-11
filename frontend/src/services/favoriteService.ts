import axios from "axios";

export interface FavoriteArtist {
  id: string;
  nombre_artistico: string;
  origen: string;
  genero_musical: string;
}

const authHeader = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getFavoriteIds = (token: string): Promise<string[]> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return axios
    .get(`${apiUrl}/api/v1/favorites/ids`, authHeader(token))
    .then((response) => response.data);
};

export const getFavoriteArtists = (token: string): Promise<FavoriteArtist[]> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return axios
    .get(`${apiUrl}/api/v1/favorites`, authHeader(token))
    .then((response) => response.data);
};

export const addFavorite = (token: string, artistId: string): Promise<void> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return axios
    .post(`${apiUrl}/api/v1/favorites/${artistId}`, null, authHeader(token))
    .then(() => undefined);
};

export const removeFavorite = (token: string, artistId: string): Promise<void> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return axios
    .delete(`${apiUrl}/api/v1/favorites/${artistId}`, authHeader(token))
    .then(() => undefined);
};
