import React, { useEffect, useState } from "react";
import axios from "axios";
import ArtistCard from "../components/ArtistCard";
import GenreFilter from "../components/GenreFilter";
import Header from "../components/Header";
import Concierto2 from "../images/Concierto2.jpg";

const Catalog = () => {
  const [artists, setArtists] = useState([]);
  const [genre, setGenre] = useState<string | null>(null);

  useEffect(() => {
    const url = genre
      ? `http://localhost:8000/api/v1/artists?genre=${encodeURIComponent(genre)}`
      : "http://localhost:8000/api/v1/artists";

    axios
      .get(url)
      .then((response) => setArtists(response.data))
      .catch((error) => console.error(error));
  }, [genre]);

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Hero con el Header compartido encima */}
      <section
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(
            rgba(5,5,30,.75),
            rgba(5,5,30,.75)
          ), url(${Concierto2})`,
        }}
      >
        <Header />

        <div className="pt-48 pb-16 px-6 text-center">
          <h1
            className="text-5xl md:text-6xl uppercase text-white leading-none"
            style={{ fontFamily: "'Permanent Marker', cursive" }}
          >
            Catálogo de Artistas
          </h1>
          <p className="mt-3 text-2xl tracking-[6px] text-orange-300">
            POP QUECHUA
          </p>
          <p className="mt-6 text-lg text-white/90 max-w-2xl mx-auto">
            Descubre el talento emergente de la fusión Quechua en Ayacucho.
          </p>
        </div>
      </section>

      {/* Filtro, flotando sobre la unión hero/grid */}
      <div className="max-w-3xl mx-auto px-6 -mt-8 relative z-10 flex justify-center">
        <GenreFilter onGenreChange={setGenre} />
      </div>

      {/* Grid de artistas */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist: any) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>

        {artists.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-slate-400">
              No se encontraron artistas para el género seleccionado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
