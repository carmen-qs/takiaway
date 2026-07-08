import React from "react";

const ITEM_COUNT = 20;

type ParticleType = "petal" | "leaf" | "flower";

const TYPES: ParticleType[] = ["petal", "leaf", "flower"];

const FloatingPetals: React.FC = () => {
  const particles = React.useMemo(
    () =>
      Array.from({ length: ITEM_COUNT }, (_, i) => ({
        id: i,
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
        left: Math.random() * 100,
        delay: Math.random() * 14,
        duration: 10 + Math.random() * 9,
        size: 8 + Math.random() * 12,
        drift: (Math.random() - 0.5) * 90,
        spin: Math.random() > 0.5 ? 360 : -360,
      })),
    []
  );

  return (
    <>
      <style>{`
        @keyframes particle-fall {
          0% {
            transform: translate(0, -10vh) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 0.85; }
          90% { opacity: 0.85; }
          100% {
            transform: translate(var(--drift), 110vh) rotate(var(--spin));
            opacity: 0;
          }
        }
        .particle {
          position: fixed;
          top: 0;
          animation-name: particle-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          pointer-events: none;
          z-index: 0;
        }
        .particle-petal {
          border-radius: 100% 0 100% 0;
          background: linear-gradient(135deg, #ec4899, #fb923c);
        }
        .particle-leaf {
          border-radius: 0 100% 0 100%;
          background: linear-gradient(135deg, #4ade80, #16a34a);
        }
        .particle-flower {
          background: transparent;
        }
      `}</style>
      {particles.map((p) => {
        const style = {
          left: `${p.left}%`,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
          "--drift": `${p.drift}px`,
          "--spin": `${p.spin}deg`,
        } as React.CSSProperties;

        if (p.type === "leaf") {
          return (
            <div
              key={p.id}
              className="particle particle-leaf"
              style={{ ...style, width: p.size * 0.7, height: p.size * 1.3 }}
            />
          );
        }

        if (p.type === "flower") {
          return (
            <svg
              key={p.id}
              className="particle"
              style={style}
              width={p.size * 1.4}
              height={p.size * 1.4}
              viewBox="0 0 24 24"
            >
              <g fill="#f472b6" opacity="0.85">
                <circle cx="12" cy="6" r="4" />
                <circle cx="12" cy="18" r="4" />
                <circle cx="6" cy="12" r="4" />
                <circle cx="18" cy="12" r="4" />
              </g>
              <circle cx="12" cy="12" r="3" fill="#fde68a" />
            </svg>
          );
        }

        return (
          <div
            key={p.id}
            className="particle particle-petal"
            style={{ ...style, width: p.size, height: p.size }}
          />
        );
      })}
    </>
  );
};

export default FloatingPetals;
