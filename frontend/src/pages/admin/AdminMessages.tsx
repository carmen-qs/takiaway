import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getContactMessages,
  ContactMessageOut,
} from "../../services/adminService";

const AdminMessages: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ContactMessageOut[]>([]);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading"
  );

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
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold">{msg.nombre}</p>
                  <p className="text-slate-500 text-xs">
                    {formatDate(msg.fecha_creacion)}
                  </p>
                </div>
                <p className="text-orange-300 text-sm mb-3">{msg.email}</p>
                <p className="text-slate-300">{msg.mensaje}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
