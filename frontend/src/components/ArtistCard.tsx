import React from "react";
import { Link } from "react-router-dom";
import { Music, MapPin, ArrowRight } from "lucide-react";

interface Artist {
  id: string;
  nombre_artistico: string;
  origen: string;
  genero_musical: string;
}

const ArtistCard = ({ artist }: { artist: Artist }) => {
  return (
    <Link
      to={`/artist/${artist.id}`}
      className="block no-underline text-inherit group"
    >
      <div className="relative bg-slate-900 border border-pink-500/20 rounded-xl p-6 shadow-md transition-all duration-300 hover:border-pink-500/60 hover:shadow-pink-500/10 hover:shadow-lg hover:-translate-y-1">
        {/* Ícono insignia, esquina superior derecha */}
        <div className="absolute -top-3 -right-3 bg-pink-600 rounded-full p-2 shadow-md">
          <Music className="text-white" size={16} />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          {artist.nombre_artistico}
        </h2>

        <p className="flex items-center gap-1.5 text-sm text-slate-400 mb-1">
          <MapPin size={14} className="text-pink-400" />
          {artist.origen}
        </p>

        <p className="text-sm text-slate-300 mb-4">{artist.genero_musical}</p>

        <span className="inline-flex items-center gap-1 text-sm font-semibold text-pink-400 group-hover:gap-2 transition-all">
          Ver perfil
          <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
};

export default ArtistCard;
