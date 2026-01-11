import Image from "next/image";

const TEAMS = [
  {
    game: "League of Legends",
    status: "PROXIMAMENTE",
    description: "División de League of Legends enfocada en alto rendimiento, disciplina y ejecución competitiva.",
    image: "/games/lol-bg.jpg", // Asegúrate de tener estas imagenes o usa una generica
    logo: "/games/lol-logo.png"
  },
  {
    game: "Valorant",
    status: "RECLUTANDO",
    description: "Equipo de Valorant orientado a precisión táctica, control total y mentalidad ganadora.",
    image: "/games/val-bg.jpg",
    logo: "/games/val-logo.png"
  },
  {
    game: "CS2",
    status: "PROXIMAMENTE",
    description: "División de CS2 basada en ejecución precisa, estrategia avanzada y consistencia competitiva.",
    image: "/games/cs2-bg.jpg",
    logo: "/games/cs2-logo.png"
  },
  {
    game: "Delta Force",
    status: "RECLUTANDO",
    description: "División de Delta Force centrada en táctica militar, coordinación extrema y control del campo.",
    image: "/games/delta-bg.jpg",
    logo: "/games/delta-logo.png"
  },
  {
    game: "Rocket League",
    status: "PROXIMAMENTE",
    description: "Equipo de Rocket League enfocado en velocidad, precisión mecánica y dominio competitivo.",
    image: "/games/rl-bg.jpg",
    logo: "/games/rl-logo.png"
  },
  {
    game: "Creadores de Contenido",
    status: "RECLUTANDO",
    description: "Creadores de contenido enfocados en marca, constancia y proyección profesional.",
    image: "/games/content-bg.jpg",
    logo: "/games/camera-logo.png"
  }
];

export default function EquiposPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-[#050505]">
      <h1 className="text-center text-6xl font-black uppercase italic mb-16 tracking-tighter">
        Nuestras <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Divisiones</span>
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TEAMS.map((team, index) => (
          <div key={index} className="group relative h-[400px] border border-white/10 bg-[#111] overflow-hidden hover:border-cyan-400 transition-all duration-500">
            
            {/* 1. FONDO TRANSPARENTE EN LA TARJETA */}
            <div className="absolute inset-0 z-0">
                {/* Si no tienes la imagen específica, usa el fondo.jpg general */}
                <Image src="/fondo.jpg" alt={team.game} fill className="object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
              {/* STATUS BADGE */}
              <div className={`absolute top-6 right-6 px-3 py-1 text-xs font-bold uppercase tracking-widest skew-x-[-12deg] ${
                  team.status === "RECLUTANDO" ? "bg-pink-600 text-white shadow-[0_0_15px_rgba(219,39,119,0.5)]" : "bg-gray-700 text-gray-400"
              }`}>
                <span className="block skew-x-[12deg]">{team.status}</span>
              </div>

              <h3 className="text-3xl font-black uppercase italic text-white mb-2 group-hover:text-cyan-400 transition-colors">{team.game}</h3>
              <div className="h-1 w-12 bg-pink-500 mb-4 group-hover:w-full transition-all duration-500"></div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {team.description}
              </p>

              {team.status === "RECLUTANDO" && (
                <button className="mt-6 w-full py-3 border border-white/20 hover:bg-cyan-400 hover:text-black hover:border-cyan-400 font-bold uppercase transition-all">
                    Postular
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}