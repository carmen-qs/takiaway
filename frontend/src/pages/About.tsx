import React from "react";
import { Music, Heart, Users } from "lucide-react";
import Header from "../components/Header";
import FloatingPetals from "../components/FloatingPetals";

const pilares = [
  {
    icon: Heart,
    titulo: "Por qué existimos",
    texto:
      "El pop quechua no tenía un hogar propio. Estaba disperso entre YouTube, TikTok y radios locales, sin un catálogo que lo tratara como el protagonista, no como 'la otra música'.",
  },
  {
    icon: Music,
    titulo: "Qué protegemos",
    texto:
      "Cada perfil respeta la voz del artista tal como la cuenta: su origen, su género, su hito de carrera. No inventamos historias, las documentamos.",
  },
  {
    icon: Users,
    titulo: "Para quién lo hacemos",
    texto:
      "Para quien busca música quechua contemporánea y no sabe por dónde empezar, y para los artistas de Ayacucho que merecen un espacio digital propio.",
  },
];

const timeline = [
  { fecha: "Fase 1", texto: "Catálogo de artistas: perfiles, géneros, biografías y videos." },
  { fecha: "Fase 2", texto: "Páginas Nosotros y Contacto, con formulario funcional conectado a base de datos." },
  { fecha: "Hoy", texto: "TakiAway sigue creciendo, un artista a la vez." },
];

const PETAL_COUNT = 16;
const petals = Array.from({ length: PETAL_COUNT }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 12,
  duration: 9 + Math.random() * 8,
  size: 8 + Math.random() * 10,
  drift: (Math.random() - 0.5) * 80,
}));

const About: React.FC = () => {
  return (
    <div className="bg-slate-950 min-h-screen relative overflow-hidden">
      <FloatingPetals />

      <div className="relative z-10">
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

          <div className="bg-slate-900/90 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-8 md:p-10 space-y-6 mb-12">
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

          <h2
            className="text-3xl text-white text-center mb-8"
            style={{ fontFamily: "'Permanent Marker', cursive" }}
          >
            Nuestra Misión
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {pilares.map(({ icon: Icon, titulo, texto }) => (
              <div
                key={titulo}
                className="bg-slate-900/90 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/50 transition-all"
              >
                <div className="bg-pink-600 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="text-white" size={20} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{titulo}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>

          <h2
            className="text-3xl text-white text-center mb-8"
            style={{ fontFamily: "'Permanent Marker', cursive" }}
          >
            Nuestro Camino
          </h2>
          <div className="space-y-6">
            {timeline.map(({ fecha, texto }, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-pink-500 mt-1.5" />
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1 bg-pink-500/30 my-1" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-pink-400 font-semibold text-sm tracking-wide">
                    {fecha}
                  </p>
                  <p className="text-slate-300">{texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
