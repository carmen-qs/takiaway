import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getContactMessages, deleteContactMessage } from "../../services/adminService";
import type { ContactMessageOut } from "../../services/adminService";

const TIPO_LABELS: Record<string, string> = {
  consulta: "Consulta",
  sugerencia: "Sugerencia",
  reclamo: "Reclamo",
  otro: "Otro",
};

const TIPO_COLORS: Record<string, string> = {
  consulta: "bg-sky-500/20 text-sky-300",
  sugerencia: "bg-emerald-500/20 text-emerald-300",
  reclamo: "bg-red-500/20 text-red-300",
  otro: "bg-slate-500/20 text-slate-300",
};

const AdminMessages: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ContactMessageOut[]>([]);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading"
  );
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    getContactMessages(token)
      .then((data) => {
        setMessages(data);
        setStatus("loaded");
      })
      .catch((error) => {
        console.error("Error fetching contact messages:", error);
        setStatus("error");
      });
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("es-PE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setDeletingId(id);
    try {
      await deleteContactMessage(token, id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error deleting contact message:", error);
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-3xl md:text-4xl uppercase text-white leading-tight"
            style={{ fontFamily: "'Permanent Marker', cursive" }}
          >
            Mensajes de contacto
          </h1>
          <button
            onClick={handleLogout}
            className="text-slate-300 hover:text-pink-400 text-sm font-medium transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        {status === "loading" && (
          <p className="text-slate-400 text-center py-12">Cargando mensajes...</p>
        )}

        {status === "error" && (
          <p className="text-red-400 text-center py-12">
            Ocurrió un error al cargar los mensajes.
          </p>
        )}

        {status === "loaded" && messages.length === 0 && (
          <p className="text-slate-400 text-center py-12">
            Aún no hay mensajes de contacto.
          </p>
        )}

        {status === "loaded" && messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-slate-900 border border-pink-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-2 gap-3">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold">{msg.nombre}</p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        TIPO_COLORS[msg.tipo] || TIPO_COLORS.otro
                      }`}
                    >
                      {TIPO_LABELS[msg.tipo] || msg.tipo}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs whitespace-nowrap">
                    {formatDate(msg.fecha_creacion)}
                  </p>
                </div>
                <p className="text-orange-300 text-sm mb-3">{msg.email}</p>
                <p className="text-slate-300 mb-4">{msg.mensaje}</p>

                {confirmingId === msg.id ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">
                      ¿Eliminar este mensaje?
                    </span>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      disabled={deletingId === msg.id}
                      className="text-sm font-medium text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                      {deletingId === msg.id ? "Eliminando..." : "Sí, eliminar"}
                    </button>
                    <button
                      onClick={() => setConfirmingId(null)}
                      className="text-sm font-medium text-slate-400 hover:text-slate-300"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingId(msg.id)}
                    className="text-sm font-medium text-slate-500 hover:text-red-400 transition-colors"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
