import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Music, LogOut, Menu, X } from "lucide-react";
import newHeader from "../images/newHeader.png";
import { useUserAuth } from "../context/UserAuthContext";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/catalog", label: "Artistas" },
  { to: "/about", label: "Nosotros" },
  { to: "/contact", label: "Contacto" },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, nombre, logout } = useUserAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className="absolute top-0 left-0 w-full min-h-[6rem] md:h-38 bg-cover bg-center z-50"
      style={{ backgroundImage: `url(${newHeader})` }}
    >
      <div className="flex justify-between items-center px-4 md:px-12 py-4 md:py-0 md:h-38">
        <div className="relative flex items-center gap-2 md:gap-3">
          <div className="absolute -inset-x-4 md:-inset-x-8 -inset-y-2 md:-inset-y-3 bg-white/95 blur-md rounded-lg -z-10" />
          <Music className="text-slate-900" size={22} />
          <div>
            <h1 className="text-slate-900 text-xl md:text-3xl font-extrabold tracking-tight">
              TakiAway
            </h1>
            <p className="text-orange-500 tracking-[3px] md:tracking-[6px] text-[10px] md:text-xs font-semibold">
              POP QUECHUA
            </p>
          </div>
        </div>

        <div className="absolute right-0 top-0 h-full w-[55%] -z-10 bg-gradient-to-l from-slate-900/70 via-slate-900/40 to-transparent hidden md:block" />

        {/* Botón hamburguesa, solo visible en mobile */}
        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="md:hidden text-white p-2 bg-slate-900/80 border border-pink-500/40 rounded-full"
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Nav de escritorio */}
        <div className="hidden md:flex items-center gap-10">
          <nav className="flex gap-12 text-white text-lg font-semibold">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative pb-2 duration-300 hover:text-pink-400 ${
                    isActive ? "text-pink-400 border-b-2 border-pink-500" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="h-6 w-px bg-white/30" />

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-white text-sm">
                Hola, <span className="text-pink-400 font-semibold">{nombre}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-white/80 hover:text-pink-400 text-sm font-medium transition-colors"
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2 transition-colors"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>

      {/* Menú desplegable de mobile */}
      {menuOpen && (
        <div className="md:hidden bg-slate-950/98 px-4 pb-6 pt-2 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={`py-3 text-lg font-semibold border-b border-white/10 ${
                  isActive ? "text-pink-400" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {isAuthenticated ? (
            <div className="pt-4 flex flex-col gap-3">
              <span className="text-white text-sm">
                Hola, <span className="text-pink-400 font-semibold">{nombre}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-white/80 text-sm font-medium"
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="mt-4 text-center rounded-full bg-pink-600 text-white text-sm font-semibold px-5 py-3"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full h-16 -z-10 bg-gradient-to-b from-transparent to-slate-950 hidden md:block" />
    </header>
  );
}
