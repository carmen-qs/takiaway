import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getArtists,
  createArtist,
  updateArtist,
  deleteArtist,
} from "../../services/adminArtistService";
import type { ArtistOut, ArtistInput, VideoInput } from "../../services/adminArtistService";

const EMPTY_FORM: ArtistInput = {
  nombre_artistico: "",
  nombre_real: "",
  origen: "",
  genero_musical: "",
  biografia: "",
  hito_relevante: "",
  fuente_url: "",
  foto_url: "",
  videos: [],
};

const AdminArtists: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [artists, setArtists] = useState<ArtistOut[]>([]);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ArtistInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const loadArtists = () => {
    setStatus("loading");
    getArtists()
      .then((data) => {
        setArtists(data);
        setStatus("loaded");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    loadArtists();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (artist: ArtistOut) => {
    setEditingId(artist.id);
    setForm({
      nombre_artistico: artist.nombre_artistico,
      nombre_real: artist.nombre_real || "",
      origen: artist.origen,
      genero_musical: artist.genero_musical,
      biografia: artist.biografia,
      hito_relevante: artist.hito_relevante,
      fuente_url: artist.fuente_url,
      foto_url: artist.foto_url || "",
      videos: artist.videos || [],
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (index: number, field: keyof VideoInput, value: string) => {
    setForm((prev) => {
      const videos = [...prev.videos];
      videos[index] = { ...videos[index], [field]: value };
      return { ...prev, videos };
    });
  };

  const addVideoRow = () => {
    setForm((prev) => ({
      ...prev,
      videos: [...prev.videos, { youtube_video_id: "", titulo: "" }],
    }));
  };

  const removeVideoRow = (index: number) => {
    setForm((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!form.nombre_artistico.trim() || !form.origen.trim() || !form.genero_musical.trim()) {
      setFormError("Nombre artístico, origen y género son obligatorios.");
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        await updateArtist(token, editingId, form);
      } else {
        await createArtist(token, form);
      }
      setShowForm(false);
      loadArtists();
    } catch (error) {
      console.error("Error saving artist:", error);
      setFormError("Ocurrió un error al guardar el artista. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await deleteArtist(token, id);
      setArtists((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error deleting artist:", error);
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-3xl md:text-4xl uppercase text-white leading-tight"
            style={{ fontFamily: "'Permanent Marker', cursive" }}
          >
            Gestionar Artistas
          </h1>
          <button
            onClick={handleLogout}
            className="text-slate-300 hover:text-pink-400 text-sm font-medium transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="flex items-center gap-6 mb-8 text-sm">
          <Link to="/admin/messages" className="text-slate-400 hover:text-pink-400">
            Mensajes
          </Link>
          <span className="text-pink-400 font-semibold">Artistas</span>
        </div>

        <button
          onClick={openCreateForm}
          className="mb-8 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-full px-6 py-2.5 transition-colors"
        >
          + Nuevo artista
        </button>

        {status === "loading" && (
          <p className="text-slate-400 text-center py-12">Cargando artistas...</p>
        )}
        {status === "error" && (
          <p className="text-red-400 text-center py-12">Error al cargar artistas.</p>
        )}

        {status === "loaded" && (
          <div className="space-y-4">
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="bg-slate-900 border border-pink-500/20 rounded-2xl p-6 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-semibold">{artist.nombre_artistico}</p>
                  <p className="text-slate-400 text-sm">
                    {artist.genero_musical} • {artist.origen}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => openEditForm(artist)}
                    className="text-sm font-medium text-slate-300 hover:text-pink-400"
                  >
                    Editar
                  </button>
                  {confirmingId === artist.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(artist.id)}
                        className="text-sm font-medium text-red-400 hover:text-red-300"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setConfirmingId(null)}
                        className="text-sm font-medium text-slate-400"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmingId(artist.id)}
                      className="text-sm font-medium text-slate-500 hover:text-red-400"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-3 md:p-6 z-50 overflow-y-auto">
            <div className="bg-slate-900 border border-pink-500/20 rounded-2xl p-4 md:p-8 max-w-2xl w-full my-6 md:my-12">
              <h2 className="text-xl font-bold text-white mb-6">
                {editingId ? "Editar artista" : "Nuevo artista"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="nombre_artistico"
                  placeholder="Nombre artístico"
                  value={form.nombre_artistico}
                  onChange={handleFieldChange}
                  className="w-full bg-slate-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                <input
                  name="nombre_real"
                  placeholder="Nombre real (opcional)"
                  value={form.nombre_real}
                  onChange={handleFieldChange}
                  className="w-full bg-slate-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                <input
                  name="origen"
                  placeholder="Origen (ej. Huamanga, Ayacucho)"
                  value={form.origen}
                  onChange={handleFieldChange}
                  className="w-full bg-slate-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                <input
                  name="genero_musical"
                  placeholder="Género musical"
                  value={form.genero_musical}
                  onChange={handleFieldChange}
                  className="w-full bg-slate-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                <textarea
                  name="biografia"
                  placeholder="Biografía"
                  rows={3}
                  value={form.biografia}
                  onChange={handleFieldChange}
                  className="w-full bg-slate-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
                />
                <textarea
                  name="hito_relevante"
                  placeholder="Hito relevante"
                  rows={2}
                  value={form.hito_relevante}
                  onChange={handleFieldChange}
                  className="w-full bg-slate-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
                />
                <input
                  name="fuente_url"
                  placeholder="URL de la fuente"
                  value={form.fuente_url}
                  onChange={handleFieldChange}
                  className="w-full bg-slate-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                <input
                  name="foto_url"
                  placeholder="URL de foto (opcional)"
                  value={form.foto_url}
                  onChange={handleFieldChange}
                  className="w-full bg-slate-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />

                <div>
                  <p className="text-slate-300 text-sm font-medium mb-2">Videos</p>
                  {form.videos.map((video, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-2 mb-3 md:mb-2 pb-3 md:pb-0 border-b md:border-b-0 border-slate-700">
                      <div className="flex gap-2">
                        <input
                          placeholder="YouTube video ID"
                          value={video.youtube_video_id}
                          onChange={(e) => handleVideoChange(index, "youtube_video_id", e.target.value)}
                          className="flex-1 min-w-0 bg-slate-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeVideoRow(index)}
                          className="md:hidden text-red-400 text-sm px-2 shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          placeholder="Título"
                          value={video.titulo}
                          onChange={(e) => handleVideoChange(index, "titulo", e.target.value)}
                          className="flex-1 min-w-0 bg-slate-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeVideoRow(index)}
                          className="hidden md:block text-red-400 text-sm px-2 shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addVideoRow}
                    className="text-sm text-pink-400 hover:text-pink-300"
                  >
                    + Agregar video
                  </button>
                </div>

                {formError && <p className="text-red-400 text-sm">{formError}</p>}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-medium rounded-full px-6 py-2.5 transition-colors"
                  >
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-slate-800 text-white font-medium rounded-full px-6 py-2.5"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArtists;
