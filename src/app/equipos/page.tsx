"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, X, User, Instagram, Twitter, Twitch, MousePointer2, Keyboard, Monitor } from "lucide-react";

// --- TIPOS DE DATOS ---
type Player = {
  nick: string;
  name: string;
  role: string;
  country: string;
  img: string; // Ruta de la foto
  bio: string;
  socials: { twitter?: string; twitch?: string; instagram?: string };
  setup: { mouse?: string; keyboard?: string; monitor?: string };
  stats: { kda?: string; hs?: string; winrate?: string };
};

// --- DATOS MOCKEADOS (Estos vendrían de tu BD en el futuro) ---
const TEAMS = [
  {
    id: "lol",
    game: "League of Legends",
    status: "ACTIVO", 
    description: "Dominio de la grieta mediante control de oleadas y teamfighting explosivo.",
    image: "/fondo.jpg", 
    roster: [
      { 
        nick: "K4POCHA", 
        name: "Nicolás Oñate", 
        role: "TOP LANER", 
        country: "CL", 
        img: "/players/p1.jpg", 
        bio: "Especialista en duelistas y split push. Conocido por su agresividad en línea y capacidad de generar presión constante.",
        socials: { twitter: "#", twitch: "#", instagram: "#" },
        setup: { mouse: "Logitech G Pro X", keyboard: "Wooting 60HE", monitor: "Zowie XL2546K" },
        stats: { kda: "4.5", hs: "N/A", winrate: "62%" }
      },
      { nick: "FAKER", name: "Lee Sang-hyeok", role: "MID LANER", country: "KR", img: "/players/p2.jpg", bio: "El rey demonio inmortal.", socials: { twitter: "#" }, setup: {}, stats: { kda: "5.1", winrate: "70%" } },
      { nick: "ONER", name: "Moon Hyeon-joon", role: "JUNGLER", country: "KR", img: "/players/p3.jpg", bio: "Control de objetivos y pathing agresivo.", socials: {}, setup: {}, stats: { kda: "3.8", winrate: "65%" } },
      { nick: "GUMAYUSI", name: "Lee Min-hyeong", role: "ADC", country: "KR", img: "/players/p4.jpg", bio: "Mecánicas perfectas en late game.", socials: {}, setup: {}, stats: { kda: "6.2", winrate: "68%" } },
      { nick: "KERIA", name: "Ryu Min-seok", role: "SUPPORT", country: "KR", img: "/players/p5.jpg", bio: "El soporte con manos de midlaner.", socials: {}, setup: {}, stats: { kda: "4.0", winrate: "66%" } },
    ]
  },
  {
    id: "val",
    game: "Valorant",
    status: "RECLUTANDO",
    description: "Precisión táctica y ejecución coordinada en cada ronda.",
    image: "/fondo.jpg",
    roster: [] // Sin roster aún
  },
  {
    id: "cs2",
    game: "Counter-Strike 2",
    status: "ACTIVO",
    description: "La tradición del shooter táctico con la nueva generación de talento.",
    image: "/fondo.jpg",
    roster: [
      { 
        nick: "S1MPLE", 
        name: "Oleksandr Kostyliev", 
        role: "AWPER", 
        country: "UA", 
        img: "/players/cs1.jpg", 
        bio: "Considerado el mejor jugador de la historia del CS:GO.",
        socials: { twitter: "#", twitch: "#" },
        setup: { mouse: "Logitech G Pro Superlight", keyboard: "Logitech G915", monitor: "BenQ Zowie" },
        stats: { kda: "1.32", hs: "45%", winrate: "58%" }
      },
      { nick: "NIKO", name: "Nikola Kovač", role: "RIFLER", country: "BA", img: "", bio: "Aim prodigioso.", socials: {}, setup: {}, stats: {} },
      { nick: "MONESY", name: "Ilya Osipov", role: "AWPER", country: "RU", img: "", bio: "El niño maravilla.", socials: {}, setup: {}, stats: {} },
    ]
  },
  {
    id: "creators",
    game: "Creadores",
    status: "ACTIVO",
    description: "Nuestras voces, nuestros rostros, nuestra comunidad.",
    image: "/fondo.jpg",
    roster: [
        { nick: "IBAI", name: "Ibai Llanos", role: "STREAMER", country: "ES", img: "", bio: "El gigante noble.", socials: { twitter: "#", twitch: "#" }, setup: {}, stats: {} }
    ]
  }
];

export default function EquiposPage() {
  const [activeRoster, setActiveRoster] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const toggleRoster = (teamId: string) => {
    setActiveRoster(activeRoster === teamId ? null : teamId);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-[#050505] relative">
      
      {/* --- MODAL DE JUGADOR (POPUP) --- */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop oscuro con blur */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedPlayer(null)} // Cierra al hacer clic fuera
          ></div>

          {/* Tarjeta del Jugador */}
          <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Botón Cerrar */}
            <button 
                onClick={() => setSelectedPlayer(null)}
                className="absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-full hover:bg-white/20 hover:text-white text-gray-400 transition-colors"
            >
                <X size={24} />
            </button>

            {/* COLUMNA IZQUIERDA: FOTO */}
            <div className="w-full md:w-2/5 relative bg-[#111] min-h-[300px] md:min-h-full group overflow-hidden">
                {/* Si tienes fotos reales, usa <Image src={selectedPlayer.img} ... /> */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                    <User size={120} strokeWidth={0.5} />
                </div>
                {/* Imagen mockeada de fondo (reemplazar con player.img real) */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
                
                {/* Nombre Grande Superpuesto */}
                <div className="absolute bottom-6 left-6 z-10">
                    <p className="text-sk-accent font-bold tracking-widest uppercase text-sm mb-1">{selectedPlayer.role}</p>
                    <h2 className="text-5xl font-black italic text-white uppercase leading-none drop-shadow-lg">{selectedPlayer.nick}</h2>
                    <p className="text-gray-400 font-mono text-sm mt-2 flex items-center gap-2">
                        <span className="text-xs border border-white/20 px-1 rounded">{selectedPlayer.country}</span> 
                        {selectedPlayer.name}
                    </p>
                </div>
            </div>

            {/* COLUMNA DERECHA: INFO */}
            <div className="w-full md:w-3/5 p-8 overflow-y-auto custom-scrollbar">
                
                {/* BIO */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold uppercase text-white mb-3 flex items-center gap-2">
                        <span className="w-1 h-6 bg-sk-accent block"></span> Bio
                    </h3>
                    <p className="text-gray-300 leading-relaxed font-light">
                        {selectedPlayer.bio || "Información confidencial del agente. No hay biografía disponible por el momento."}
                    </p>
                </div>

                {/* REDES SOCIALES */}
                <div className="flex gap-4 mb-8">
                    {selectedPlayer.socials?.twitch && (
                        <a href={selectedPlayer.socials.twitch} className="p-3 bg-[#6441a5]/10 border border-[#6441a5]/20 text-[#6441a5] hover:bg-[#6441a5] hover:text-white rounded transition-all"><Twitch size={20}/></a>
                    )}
                    {selectedPlayer.socials?.twitter && (
                        <a href={selectedPlayer.socials.twitter} className="p-3 bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white rounded transition-all"><Twitter size={20}/></a>
                    )}
                     {selectedPlayer.socials?.instagram && (
                        <a href={selectedPlayer.socials.instagram} className="p-3 bg-[#E1306C]/10 border border-[#E1306C]/20 text-[#E1306C] hover:bg-[#E1306C] hover:text-white rounded transition-all"><Instagram size={20}/></a>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* ESTADÍSTICAS */}
                    <div>
                        <h4 className="text-sm font-bold uppercase text-gray-500 mb-4 tracking-widest">Estadísticas (Season Actual)</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-gray-400 text-sm">KDA Ratio</span>
                                <span className="text-sk-accent font-black text-xl">{selectedPlayer.stats?.kda || "-"}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-gray-400 text-sm">Winrate</span>
                                <span className="text-white font-bold">{selectedPlayer.stats?.winrate || "-"}</span>
                            </div>
                            {selectedPlayer.stats?.hs && (
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-gray-400 text-sm">Headshot %</span>
                                    <span className="text-white font-bold">{selectedPlayer.stats.hs}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SETUP / PERIFÉRICOS */}
                    <div>
                        <h4 className="text-sm font-bold uppercase text-gray-500 mb-4 tracking-widest">Setup & Gear</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 group">
                                <MousePointer2 size={18} className="text-gray-500 group-hover:text-sk-accent transition-colors" />
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase">Mouse</p>
                                    <p className="text-white text-sm font-medium">{selectedPlayer.setup?.mouse || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <Keyboard size={18} className="text-gray-500 group-hover:text-sk-accent transition-colors" />
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase">Teclado</p>
                                    <p className="text-white text-sm font-medium">{selectedPlayer.setup?.keyboard || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <Monitor size={18} className="text-gray-500 group-hover:text-sk-accent transition-colors" />
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase">Monitor</p>
                                    <p className="text-white text-sm font-medium">{selectedPlayer.setup?.monitor || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
          </div>
        </div>
      )}


      {/* --- CONTENIDO PRINCIPAL DE LA PÁGINA --- */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic mb-4 tracking-tighter text-white">
            Nuestras <span className="text-sk-accent">Divisiones</span>
          </h1>
          <p className="text-gray-200 max-w-2xl mx-auto text-lg">
            La vanguardia competitiva de Disp7aceD Network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAMS.map((team, index) => {
            const isRosterOpen = activeRoster === team.id;
            
            return (
              <div key={team.id} className="group relative h-[500px] border border-white/10 bg-[#111] overflow-hidden hover:border-sk-accent transition-all duration-500 rounded-xl hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col">
                
                {/* FONDO IMAGEN */}
                <div className={`absolute inset-0 z-0 transition-all duration-500 ${isRosterOpen ? "opacity-10 blur-sm" : "opacity-100"}`}>
                   <Image 
                      src={team.image} 
                      alt={team.game} 
                      fill 
                      className="object-cover opacity-40 group-hover:opacity-60 grayscale group-hover:grayscale-0 transition-all" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/50 to-transparent" />
                </div>

                {/* CONTENIDO TARJETA */}
                <div className={`relative z-10 flex flex-col h-full p-8 transition-all duration-500 ${isRosterOpen ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}`}>
                   
                   <div className={`self-end px-3 py-1 text-[10px] font-bold uppercase tracking-widest border mb-auto ${
                      team.status === "ACTIVO" ? "bg-sk-accent text-white border-sk-accent" : 
                      team.status === "RECLUTANDO" ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50" :
                      "bg-white/10 text-gray-500 border-white/10"
                   }`}>
                      {team.status}
                   </div>

                   <h3 className="text-4xl font-black uppercase italic text-white mb-2 group-hover:text-sk-accent transition-colors drop-shadow-lg">
                      {team.game}
                   </h3>
                   <div className="h-1 w-12 bg-sk-accent mb-4 group-hover:w-full transition-all duration-500"></div>
                   <p className="text-gray-200 text-sm leading-relaxed mb-8">
                      {team.description}
                   </p>

                   <div className="mt-auto">
                      {team.status === "ACTIVO" ? (
                          <button 
                            onClick={() => toggleRoster(team.id)}
                            className="w-full flex items-center justify-center gap-2 py-3 border border-sk-accent bg-sk-accent/10 text-white font-bold uppercase tracking-wider hover:bg-sk-accent hover:shadow-[0_0_20px_var(--color-sk-accent)] transition-all duration-300 rounded"
                          >
                             Ver Roster <ArrowRight size={16} />
                          </button>
                      ) : (
                          <div className="w-full py-3 text-center text-gray-500 font-bold uppercase text-xs tracking-widest border border-white/10 rounded cursor-not-allowed">
                              {team.status === "RECLUTANDO" ? "Reclutamiento Abierto" : "Próximamente"}
                          </div>
                      )}
                   </div>
                </div>

                {/* --- VISTA LISTA DE ROSTER (SLIDE UP) --- */}
                <div className={`absolute inset-0 z-20 bg-[#111] flex flex-col transition-all duration-500 p-4 ${isRosterOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
                   
                   <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                      <h4 className="text-xl font-black uppercase italic text-white">Integrantes <span className="text-sk-accent">Actuales</span></h4>
                      <button onClick={() => toggleRoster(team.id)} className="text-gray-400 hover:text-white transition-colors">
                         <X size={24} />
                      </button>
                   </div>

                   <div className="flex-grow overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {team.roster && team.roster.length > 0 ? (
                         team.roster.map((player, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => setSelectedPlayer(player as Player)} // AQUI ESTÁ LA MAGIA DEL CLICK
                                className="flex items-center gap-4 bg-white/5 p-3 rounded hover:bg-white/10 transition-colors border border-transparent hover:border-sk-accent/30 group/player cursor-pointer"
                            >
                               <div className="w-12 h-12 rounded bg-black overflow-hidden relative border border-white/10 shrink-0">
                                  {/* Si tienes fotos: <Image src={player.img} ... /> */}
                                  <div className="absolute inset-0 flex items-center justify-center text-gray-600 group-hover/player:text-sk-accent transition-colors">
                                     <User size={20} />
                                  </div>
                               </div>
                               
                               <div className="flex flex-col">
                                  <span className="text-lg font-black uppercase italic text-white leading-none group-hover/player:text-sk-accent transition-colors">{player.nick}</span>
                                  <span className="text-xs text-sk-accent font-bold tracking-widest uppercase">{player.role}</span>
                               </div>
                               
                               <ArrowRight size={16} className="ml-auto text-gray-600 group-hover/player:text-white opacity-0 group-hover/player:opacity-100 transition-all -translate-x-2 group-hover/player:translate-x-0" />
                            </div>
                         ))
                      ) : (
                         <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                            No hay jugadores activos.
                         </div>
                      )}
                   </div>
                   <p className="text-center text-[10px] text-gray-600 uppercase mt-2">Click en un jugador para ver perfil</p>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}