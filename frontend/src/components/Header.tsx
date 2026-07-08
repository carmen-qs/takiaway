import { Link, useLocation } from "react-router-dom";
import { Music } from "lucide-react";
import newHeader from "../images/newHeader.png";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/catalog", label: "Artistas" },
  { to: "/about", label: "Nosotros" },
  { to: "/contact", label: "Contacto" },
];

export default function Header() {
  const location = useLocation();

  return (
    <header
      className="absolute top-0 left-0 w-full h-38 bg-cover bg-center flex justify-between items-center px-12 z-50"
      style={{ backgroundImage: `url(${newHeader})` }}
    >
      <div className="relative flex items-center gap-3 py-4">
        <div className="absolute -inset-x-8 -inset-y-3 bg-white/95 blur-md rounded-lg -z-10" />
        <Music className="text-slate-900" size={28} />
        <div>
          <h1 className="text-slate-900 text-3xl font-extrabold tracking-tight">
            TakiAway
          </h1>
          <p className="text-orange-500 tracking-[6px] text-xs font-semibold">
            POP QUECHUA
          </p>
        </div>
      </div>

      <div className="absolute right-0 top-0 h-full w-[45%] -z-10 bg-gradient-to-l from-slate-900/70 via-slate-900/40 to-transparent" />

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
      <div className="absolute bottom-0 left-0 w-full h-16 -z-10 bg-gradient-to-b from-transparent to-slate-950" />
    </header>
  );
}
