import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Music, MapPin, ArrowRight, Heart } from "lucide-react";
import AndeanPattern, { getColorForGenre } from "./AndeanPattern";
import { useUserAuth } from "../context/UserAuthContext";

interface Artist {
  id: string;
  nombre_artistico: string;
  origen: string;
  genero_musical: string;
}

interface ArtistCardProps {
  artist: Artist;
  isFavorite?: boolean;
  onToggleFavorite?: (artistId: string) => void;
}

const ArtistCard = ({ artist, isFavorite = false, onToggleFavorite }: ArtistCardProps) => {
  const [accentColor] = getColorForGenre(artist.genero_musical);
  const { isAuthenticated } = useUserAuth();

  const handleFavoriteClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(artist.id);
  };

  return (
    <Link
      to={`/artist/${artist.id}`}
      className="block no-underline text-inherit group"
    >
      <div className="relative bg-slate-900 border border-pink-500/20 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:border-pink-500/60 hover:shadow-pink-500/10 hover:shadow-lg hover:-translate-y-1">
        <div className="relative h-20 w-full bg-slate-950">
          <AndeanPattern
            genre={artist.genero_musical}
            className="absolute inset-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />
          <div
            className="absolute -top-3 -right-3 rounded-full p-2 shadow-md z-10"
            style={{ backgroundColor: accentColor }}
          >
            <Music className="text-white" size={16} />
          </div>

          {isAuthenticated && onToggleFavorite && (
            <button
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              className="absolute top-2 left-2 z-10 bg-slate-950/70 hover:bg-slate-950 rounded-full p-1.5 transition-colors"
            >
              <Heart
                size={16}
                className={isFavorite ? "fill-pink-500 text-pink-500" : "text-white"}
              />
            </button>
          )}
        </div>

        <div className="p-6 pt-4">
          <h2
            className="text-xl text-white mb-2"
            style={{ fontFamily: "'Permanent Marker', cursive" }}
          >
            {artist.nombre_artistico}
          </h2>
          <p className="flex items-center gap-1.5 text-sm text-slate-400 mb-1">
            <MapPin size={14} style={{ color: accentColor }} />
            {artist.origen}
          </p>
          <p className="text-sm text-slate-300 mb-4">{artist.genero_musical}</p>
          <span
            className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all"
            style={{ color: accentColor }}
          >
            Ver perfil
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ArtistCard;
