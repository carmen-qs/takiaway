import React, { useState } from "react";
import Header from "../components/Header";
import { sendContactMessage } from "../services/contactService";

interface FormErrors {
  nombre?: string;
  email?: string;
  mensaje?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const Contact: React.FC = () => {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido.";
    }
    if (!form.email.trim()) {
      newErrors.email = "El correo es requerido.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      newErrors.email = "El formato del correo no es válido.";
    }
    if (!form.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es requerido.";
    }
    return newErrors;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setStatus("loading");
    setErrorMsg(null);

    sendContactMessage(form)
      .then((response) => {
        setStatus("success");
        setSuccessMessage(response.message);
        setForm({ nombre: "", email: "", mensaje: "" });
      })
      .catch((error) => {
        console.error("Error sending contact message:", error);
        setStatus("error");
        setErrorMsg(
          error.response?.status === 422
            ? "Revisa los datos ingresados e intenta de nuevo."
            : "Ocurrió un error al enviar tu mensaje. Intenta más tarde.",
        );
      });
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      <div className="relative h-38">
        <Header />
      </div>
      <div className="max-w-2xl mx-auto px-6 py-20">
        <h1
          className="text-4xl md:text-6xl uppercase text-white leading-tight mb-6 text-center"
          style={{ fontFamily: "'Permanent Marker', cursive" }}
        >
          Contacto
        </h1>
        <p className="text-2xl tracking-[6px] text-orange-300 text-center mb-10">
          POP QUECHUA
        </p>

        <div className="bg-slate-900 border border-pink-500/20 rounded-2xl p-8 md:p-10">
          {status === "success" ? (
            <p className="text-slate-300 text-lg text-center">
              {successMessage || "¡Gracias por escribirnos!"}
            </p>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full bg-slate-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 border-none"
                />
                {errors.nombre && (
                  <p className="text-red-400 text-sm mt-1">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-slate-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 border-none"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="mensaje"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  value={form.mensaje}
                  onChange={handleChange}
                  className="w-full bg-slate-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 border-none resize-none"
                />
                {errors.mensaje && (
                  <p className="text-red-400 text-sm mt-1">{errors.mensaje}</p>
                )}
              </div>

              {status === "error" && errorMsg && (
                <p className="text-red-400 text-sm text-center">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-medium rounded-full px-6 py-3 transition-colors"
              >
                {status === "loading" ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
