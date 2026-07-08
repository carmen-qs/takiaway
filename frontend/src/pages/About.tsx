import React from "react";
import Header from "../components/Header";

const About: React.FC = () => {
  return (
    <div className="bg-slate-950 min-h-screen">
      <div className="relative h-38">
        <Header />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1
          className="text-4xl md:text-6xl uppercase text-white leading-tight mb-6 text-center"
          style={{ fontFamily: "'Permanent Marker', cursive" }}
        >
          Nosotros
        </h1>
        <p className="text-2xl tracking-[6px] text-orange-300 text-center mb-10">
          POP QUECHUA
        </p>

        <div className="bg-slate-900 border border-pink-500/20 rounded-2xl p-8 md:p-10 space-y-6">
          <p className="text-slate-300 text-lg leading-relaxed">
            TakiAway nace para visibilizar a los artistas que fusionan el
            quechua con géneros populares como el pop, el trap, el rap y la
            electrónica. Creemos que la música es un puente vivo entre las
            raíces ayacuchanas y las nuevas generaciones.
          </p>
          <p className="text-slate-300 text-lg leading-relaxed">
            Este catálogo reúne perfiles, biografías e hitos de carrera de
            talento emergente, con el objetivo de darles un espacio digital
            propio y facilitar que más personas descubran y sigan su trabajo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
