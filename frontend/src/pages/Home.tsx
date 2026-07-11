import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube, FaSpotify } from "react-icons/fa";
import { Music, MousePointer2 } from "lucide-react";
import Footer from "../images/Footer.png";
import Concierto1 from "../images/Concierto1.jpg";
import Concierto2 from "../images/Concierto2.jpg";
// import Concierto3 from "../images/Concierto3.jpg";
import Concierto4 from "../images/Concierto4.jpg";
import Concierto5 from "../images/Concierto5.jpg";
import Header from "../components/Header";
import FloatingPetals from "../components/FloatingPetals";

const heroImages = [Concierto1, Concierto2, Concierto4, Concierto5];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000); // cambia cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <FloatingPetals />
      <section className="relative h-screen overflow-hidden bg-black">
        {/* Capas de fondo apiladas, con fade cruzado entre ellas */}
        {heroImages.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-3000 ease-in-out"
            style={{
              backgroundImage: `linear-gradient(
                rgba(5,5,30,.70),
                rgba(5,5,30,.70)
              ), url(${img})`,
              opacity: currentImage === index ? 1 : 0,
            }}
          />
        ))}

        {/* Header */}
        <Header />

        {/* Íconos sociales verticales, lado izquierdo */}
        <div className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-6">
          <span className="w-px h-16 bg-white/40" />
          <a href="#" className="text-white hover:text-pink-500 transition">
            <FaFacebookF size={18} />
          </a>
          <a href="#" className="text-white hover:text-pink-500 transition">
            <FaInstagram size={18} />
          </a>
          <a href="#" className="text-white hover:text-pink-500 transition">
            <FaYoutube size={18} />
          </a>
          <a href="#" className="text-white hover:text-pink-500 transition">
            <FaSpotify size={18} />
          </a>
          <span className="w-px h-16 bg-white/40" />
        </div>

        {/* Hero */}
        <div className="relative z-10 flex items-center h-full px-6 md:px-32">
          <div className="max-w-2xl">
            <h1
              className="text-4xl sm:text-5xl md:text-7xl uppercase text-white leading-none"
              style={{ fontFamily: "'Permanent Marker', cursive" }}
            >
              Artistas
            </h1>

            <h1
              className="text-4xl sm:text-5xl md:text-7xl uppercase text-pink-600 leading-none"
              style={{ fontFamily: "'Permanent Marker', cursive" }}
            >
              Ayacuchanos
            </h1>

            <h2 className="mt-4 text-lg sm:text-2xl md:text-3xl tracking-[4px] sm:tracking-[10px] text-orange-300">
              POP QUECHUA
            </h2>

            <p className="mt-6 md:mt-8 text-base md:text-xl text-white leading-7 md:leading-9">
              La música que nace de nuestra tierra, mezclando tradición y
              modernidad.
            </p>

            <Link
              to="/catalog"
              className="mt-8 md:mt-10 flex items-center gap-2 rounded-full bg-pink-600 px-6 md:px-10 py-3 md:py-4 text-base md:text-xl font-bold text-white transition hover:bg-pink-700 w-fit"
            >
              <Music size={20} />
              Explorar Artistas
            </Link>
          </div>
        </div>

        {/* Ícono de scroll */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1 text-white/80 animate-bounce">
          <MousePointer2 size={22} className="rotate-90" />
        </div>

        {/* Borde inferior tipo pincelada rota */}
        <svg
          className="absolute bottom-0 left-0 w-full h-24 z-30"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            fill="#000"
            d="M0,40 C120,80 240,10 360,50 C480,90 600,20 720,45
             C840,70 960,15 1080,55 C1200,95 1320,30 1440,60
             L1440,100 L0,100 Z"
          />
        </svg>
      </section>

      {/* Sección "Conoce a los artistas" con tu imagen Footer.png de fondo */}
      <section
        className="relative py-24 px-12 text-center bg-cover bg-center bg-white"
        style={{ backgroundImage: `url(${Footer})` }}
      >
        <div className="relative z-10">
          <p className="text-pink-600 font-semibold tracking-[4px] text-sm uppercase mb-3">
            Nuestros Talentos
          </p>
          <h2 className="text-4xl font-bold text-slate-900">
            Conoce a los artistas
          </h2>

          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="w-16 h-px bg-pink-300" />
            <span className="w-2 h-2 bg-pink-500 rotate-45" />
            <span className="w-16 h-px bg-pink-300" />
          </div>
        </div>
      </section>
    </>
  );
}
