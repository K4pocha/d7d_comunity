import Link from "next/link";

const teams = [
  { id: "lol", name: "League of Legends", status: "Reclutando", type: "MOBA" },
  { id: "valorant", name: "Valorant", status: "Completo", type: "FPS" },
  { id: "rocket", name: "Rocket League", status: "Activo", type: "SPORTS" },
  { id: "cs2", name: "CS:GO 2", status: "Próximamente", type: "FPS" },
];

export default function EquiposPage() {
  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-6xl md:text-8xl font-black italic uppercase mb-2">
        Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-d7d-cyan to-blue-600">Equipos</span>
      </h1>
      <p className="text-gray-400 text-xl font-body mb-12">Divisiones competitivas actuales y futuras.</p>

      {/* GRID DE EQUIPOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-sk-dark group border border-white/5 hover:border-d7d-cyan p-8 transition-all hover:shadow-[0_0_30px_rgba(0,242,255,0.1)] relative overflow-hidden">
            {/* Fondo Texto Gigante Decorativo */}
            <span className="absolute -top-4 -right-4 text-8xl font-black text-white/5 select-none pointer-events-none group-hover:text-white/10 transition-colors">
              {team.type}
            </span>

            <div className="flex justify-between items-start mb-16 relative z-10">
              <span className="bg-white/10 px-2 py-1 text-xs font-bold uppercase text-gray-300">{team.type}</span>
              <span className={`px-2 py-1 text-xs font-bold uppercase ${team.status === 'Reclutando' ? 'text-green-400' : 'text-gray-500'}`}>
                {team.status}
              </span>
            </div>

            <h2 className="text-4xl font-bold uppercase italic mb-4 relative z-10">{team.name}</h2>
            <p className="text-gray-400 text-sm font-body mb-8 relative z-10">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
            </p>

            {/* BOTÓN VER ROSTER */}
            <Link 
              href={`/equipos/${team.id}`} // ESTO LLEVA A LA PAGINA DEL EQUIPO
              className="inline-block w-full text-center border border-white/20 py-3 font-bold uppercase hover:bg-white hover:text-black transition-colors relative z-10"
            >
              Ver Roster
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}