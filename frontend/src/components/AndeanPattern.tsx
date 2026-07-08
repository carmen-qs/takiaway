import React from "react";

// Paleta de colores del proyecto, cada par [primario, secundario]
const PALETTE: [string, string][] = [
  ["#ec4899", "#f472b6"], // rosa
  ["#f97316", "#fb923c"], // naranja
  ["#a855f7", "#c084fc"], // púrpura
  ["#14b8a6", "#5eead4"], // teal
  ["#eab308", "#facc15"], // amarillo
  ["#ef4444", "#f87171"], // rojo
];

/**
 * Asigna un color consistente a partir de un string (género musical),
 * usando un hash simple. El mismo género siempre produce el mismo color.
 */
function getColorForGenre(genre: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < genre.length; i++) {
    hash = genre.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
}

interface AndeanPatternProps {
  genre: string;
  className?: string;
}

/**
 * Patrón geométrico original inspirado en motivos textiles andinos
 * (chakanas, rombos, zigzags). No reproduce ninguna obra existente:
 * son formas geométricas generales, generadas proceduralmente aquí.
 */
const AndeanPattern: React.FC<AndeanPatternProps> = ({ genre, className }) => {
  const [primary, secondary] = getColorForGenre(genre);
  const patternId = `andean-${genre.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      className={className}
      viewBox="0 0 200 80"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${patternId}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={primary} stopOpacity="0.35" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.15" />
        </linearGradient>
        <pattern
          id={patternId}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(0)"
        >
          <rect x="16" y="16" width="8" height="8" fill={primary} opacity="0.5" />
          <rect x="12" y="12" width="4" height="4" fill={secondary} opacity="0.4" />
          <rect x="24" y="12" width="4" height="4" fill={secondary} opacity="0.4" />
          <rect x="12" y="24" width="4" height="4" fill={secondary} opacity="0.4" />
          <rect x="24" y="24" width="4" height="4" fill={secondary} opacity="0.4" />
          <path d="M0 20 L4 16 L8 20 L4 24 Z" fill={secondary} opacity="0.3" />
          <path d="M32 20 L36 16 L40 20 L36 24 Z" fill={secondary} opacity="0.3" />
          <path
            d="M0 36 L10 30 L20 36 L30 30 L40 36"
            stroke={primary}
            strokeWidth="1.5"
            fill="none"
            opacity="0.35"
          />
        </pattern>
      </defs>
      <rect width="200" height="80" fill={`url(#${patternId}-bg)`} />
      <rect width="200" height="80" fill={`url(#${patternId})`} />
    </svg>
  );
};

export default AndeanPattern;
export { getColorForGenre };
