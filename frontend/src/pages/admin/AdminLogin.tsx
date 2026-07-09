import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginRequest } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

interface FormErrors {
  email?: string;
  password?: string;
}

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login: storeToken } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.email.trim()) {
      newErrors.email = "El correo es requerido.";
    }
    if (!form.password.trim()) {
      newErrors.password = "La contraseña es requerida.";
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

    loginRequest(form)
      .then((response) => {
        storeToken(response.access_token);
        navigate("/admin/messages");
      })
      .catch((error) => {
        console.error("Error during admin login:", error);
        setStatus("error");
        setErrorMsg(
          error.response?.status === 401
            ? "Correo o contraseña incorrectos."
            : "Ocurrió un error al iniciar sesión. Intenta más tarde."
        );
      });
  };

  return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1
          className="text-3xl md:text-4xl uppercase text-white leading-tight mb-8 text-center"
          style={{ fontFamily: "'Permanent Marker', cursive" }}
        >
          Admin
        </h1>

        <div className="bg-slate-900 border border-pink-500/20 rounded-2xl p-8 md:p-10">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-slate-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 border-none"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
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
              {status === "loading" ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
