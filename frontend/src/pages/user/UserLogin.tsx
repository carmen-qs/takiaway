import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../services/userService";
import { useUserAuth } from "../../context/UserAuthContext";
import FloatingPetals from "../../components/FloatingPetals";

interface FormErrors {
  nombre?: string;
  email?: string;
  password?: string;
}

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login: storeSession } = useUserAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (mode === "register" && !form.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido.";
    }
    if (!form.email.trim()) {
      newErrors.email = "El correo es requerido.";
    }
    if (!form.password.trim()) {
      newErrors.password = "La contraseña es requerida.";
    }
    return newErrors;
  };

  const handleLogin = async () => {
    const response = await loginUser({ email: form.email, password: form.password });
    storeSession(response.access_token, response.nombre, response.email);
    navigate("/");
  };

  const handleRegister = async () => {
    await registerUser(form);
    const loginResponse = await loginUser({
      email: form.email,
      password: form.password,
    });
    storeSession(loginResponse.access_token, form.nombre, form.email);
    navigate("/");
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

    const action = mode === "login" ? handleLogin() : handleRegister();

    action.catch((error) => {
      console.error("Error de autenticación de usuario:", error);
      setStatus("error");
      if (error.response?.status === 401) {
        setErrorMsg("Correo o contraseña incorrectos.");
      } else if (error.response?.status === 409) {
        setErrorMsg("Ya existe una cuenta con ese correo.");
      } else {
        setErrorMsg("Ocurrió un error. Intenta más tarde.");
      }
    });
  };

  return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <FloatingPetals />
      <div className="w-full max-w-md">
        <h1
          className="text-3xl md:text-4xl uppercase text-white leading-tight mb-2 text-center"
          style={{ fontFamily: "'Permanent Marker', cursive" }}
        >
          {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
        </h1>
        <p className="text-orange-300 text-center tracking-[4px] text-sm mb-8">
          POP QUECHUA
        </p>

        <div className="bg-slate-900 border border-pink-500/20 rounded-2xl p-8 md:p-10">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {mode === "register" && (
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
            )}

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
              {status === "loading"
                ? "Procesando..."
                : mode === "login"
                ? "Iniciar sesión"
                : "Crear cuenta"}
            </button>
          </form>

          <p className="text-slate-400 text-sm text-center mt-6">
            {mode === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrors({});
                    setErrorMsg(null);
                  }}
                  className="text-pink-400 hover:underline"
                >
                  Crear una
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrors({});
                    setErrorMsg(null);
                  }}
                  className="text-pink-400 hover:underline"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </div>

        <Link
          to="/"
          className="block text-center text-slate-500 text-sm mt-6 hover:text-slate-300"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
