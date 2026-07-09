import React, { useState, useEffect } from "react";
import axios from "axios";
import { Music } from "lucide-react";

interface GenreFilterProps {
  onGenreChange: (genre: string | null) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ onGenreChange }) => {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/v1/genres`)
      .then((response) => {
        setGenres(response.data);
      })
      .catch((error) => {
        console.error("Error fetching genres:", error);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedGenre(value);
    onGenreChange(value === "" ? null : value);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-900 border border-pink-500/40 rounded-2xl sm:rounded-full px-4 sm:px-5 py-3 w-full sm:w-auto">
      <div className="flex items-center gap-2 shrink-0">
        <Music className="text-pink-400" size={16} />
        <label
          htmlFor="genre-select"
          className="text-sm font-medium text-slate-300 whitespace-nowrap"
        >
          Filtrar por género:
        </label>
      </div>
      <select
        id="genre-select"
        value={selectedGenre}
        onChange={handleChange}
        className="bg-slate-900 text-white text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-pink-500 border-none w-full sm:w-auto min-w-0"
      >
        <option value="" className="bg-slate-900">
          Todos los géneros
        </option>
        {genres.map((genre) => (
          <option key={genre} value={genre} className="bg-slate-900">
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GenreFilter;
