import Image from "next/image";

const TEAMS = [
  {
    game: "League of Legends",
    status: "PROXIMAMENTE",
    description: "División de League of Legends enfocada en alto rendimiento, disciplina y ejecución competitiva.",
    image: "/fondo.jpg", 
    logo: "/games/lol-logo.png"
  },
  {
    game: "Valorant",
    status: "RECLUTANDO",
    description: "Equipo de Valorant orientado a precisión táctica, control total y mentalidad ganadora.",
    image: "/fondo.jpg",
    logo: "/games/val-logo.png"
  },
  {
    game: "CS2",
    status: "PROXIMAMENTE",
    description: "División de CS2 basada en ejecución precisa, estrategia avanzada y consistencia competitiva.",
    image: "/fondo.jpg",
    logo: "/games/cs2-logo.png"
  },
  {
    game: "Delta Force",
    status: "RECLUTANDO",
    description: "División de Delta Force centrada en táctica militar, coordinación extrema y control del campo.",
    image: "/fondo.jpg",
    logo: "/games/delta-logo.png"
  },
  {
    game: "Rocket League",
    status: "PROXIMAMENTE",
    description: "Equipo de Rocket League enfocado en velocidad, precisión mecánica y dominio competitivo.",
    image: "/fondo.jpg",
    logo: "/games/rl-logo.png"
  },
  {
    game: "Creadores de Contenido",
    status: "RECLUTANDO",
    description: "Creadores de contenido enfocados en marca, constancia y proyección profesional.",
    image: "/fondo.jpg",
    logo: "/games/camera-logo.png"
  }
];

export default function EquiposPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-[#050505]">
      
      <h1 className="text-center text-6xl font-black uppercase italic mb-16 tracking-tighter">
        Nuestras <span className="text-sk-accent">Divisiones</span>
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TEAMS.map((team, index) => (
          // El borde al hacer hover también usa el color del tema
          <div key={index} className="group relative h-[400px] border border-white/10 bg-[#111] overflow-hidden hover:border-sk-accent transition-all duration-500">
            
            {/* FONDO DE LA TARJETA */}
            <div className="absolute inset-0 z-0">
                <Image src={team.image} alt={team.game} fill className="object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
              
              <div className={`absolute top-6 right-6 px-3 py-1 text-xs font-bold uppercase tracking-widest skew-x-[-12deg] transition-colors duration-300 ${
                  team.status === "RECLUTANDO" 
                  ? "bg-sk-accent text-white shadow-[0_0_15px_var(--color-sk-accent)]" 
                  : "bg-gray-700 text-gray-400"
              }`}>
                <span className="block skew-x-[12deg]">{team.status}</span>
              </div>

              {/* NOMBRE DEL JUEGO */}
              <h3 className="text-3xl font-black uppercase italic text-white mb-2 group-hover:text-sk-accent transition-colors">
                {team.game}
              </h3>
              <div className="h-1 w-12 bg-sk-accent mb-4 group-hover:w-full transition-all duration-500"></div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {team.description}
              </p>

              {team.status === "RECLUTANDO" && (
                <button className="mt-6 w-full py-3 border border-white/20 hover:bg-sk-accent hover:text-white hover:border-sk-accent font-bold uppercase transition-all duration-300">
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