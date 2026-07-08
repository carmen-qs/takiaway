import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, MapPin } from "lucide-react";
import VideoPlayer from "../components/VideoPlayer";
import Header from "../components/Header";

interface Artist {
  id: string;
  nombre_artistico: string;
  nombre_real: string | null;
  origen: string;
  genero_musical: string;
  biografia: string;
  hito_relevante: string;
  videos: {
    youtube_video_id: string;
    titulo: string;
  }[];
}

const ArtistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:8000/api/v1/artists/${id}`)
      .then((response) => {
        setArtist(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error loading artist profile");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <p className="text-slate-400 font-medium">
          Cargando perfil del artista...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <p className="text-pink-500 font-medium">{error}</p>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Artista no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Header compartido, necesita un contenedor con altura para posicionarse */}
      <div className="relative h-38">
        <Header />
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/catalog")}
          className="mb-8 px-4 py-2 bg-slate-900 border border-pink-500/30 rounded-lg shadow-sm hover:border-pink-500 transition-all flex items-center gap-2 text-slate-200 font-medium"
        >
          <ArrowLeft size={16} />
          Volver al catálogo
        </button>

        <div className="space-y-12">
          <header className="text-center md:text-left">
            <h1
              className="text-4xl md:text-6xl uppercase text-white leading-tight mb-3"
              style={{ fontFamily: "'Permanent Marker', cursive" }}
            >
              {artist.nombre_artistico}
            </h1>
            <p className="flex items-center justify-center md:justify-start gap-2 text-xl md:text-2xl text-orange-300 font-medium">
              {artist.genero_musical}
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-slate-400 text-lg">
                <MapPin size={16} className="text-pink-400" />
                {artist.origen}
              </span>
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-10">
              <section className="bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-pink-500/20">
                <h2 className="text-2xl font-bold mb-4 text-white border-b border-slate-700 pb-2">
                  Biografía
                </h2>
                <p className="text-slate-300 leading-relaxed text-lg">
                  {artist.biografia}
                </p>
              </section>

              <section className="bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-pink-500/20">
                <h2 className="text-2xl font-bold mb-4 text-white border-b border-slate-700 pb-2">
                  Hito de Carrera
                </h2>
                <p className="text-slate-300 leading-relaxed text-lg italic">
                  "{artist.hito_relevante}"
                </p>
              </section>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-slate-900/60 p-6 md:p-8 rounded-2xl shadow-inner border border-pink-500/20">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                  <span>Videos Oficiales</span>
                </h2>
                {artist.videos && artist.videos.length > 0 ? (
                  <div className="space-y-8">
                    {artist.videos.map((video, index) => (
                      <VideoPlayer
                        key={index}
                        videoId={video.youtube_video_id}
                        title={video.titulo}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">
                    No hay videos disponibles para este artista.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetail;
