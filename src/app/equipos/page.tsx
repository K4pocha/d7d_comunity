"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, X, User, Instagram, Twitter, Twitch, MousePointer2, Keyboard, Monitor } from "lucide-react";

// --- TIPOS DE DATOS ADAPTADOS A LA DB ---
type Player = {
  id: number;
  nickname: string;
  role: string;
  country: string;
  photo_url: string;
  bio: string;
  socials: any; // Viene como JSON de la DB
  setup: any;   // Viene como JSON de la DB
};

type Team = {
  id: number;
  name: string;
  slug: string;
  status: string;
  description: string;
  image_url: string;
  roster?: Player[];
};

export default function EquiposPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRoster, setActiveRoster] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // 1. CARGAR EQUIPOS AL INICIAR
  useEffect(() => {
    fetch('/api/teams')
      .then(res => res.json())
      .then(data => {
        setTeams(data);
        setLoading(false);
      })
      .catch(err => console.error("Error cargando equipos:", err));
  }, []);

  // 2. CARGAR ROSTER AL HACER CLICK
  const toggleRoster = async (teamId: number) => {
    if (activeRoster === teamId) {
      setActiveRoster(null);
      return;
    }

    const teamIndex = teams.findIndex(t => t.id === teamId);
    if (teams[teamIndex].roster && teams[teamIndex].roster!.length > 0) {
      setActiveRoster(teamId);
      return;
    }

    try {
      const res = await fetch(`/api/roster?game_id=${teamId}`);
      const players = await res.json();
      
      const newTeams = [...teams];
      newTeams[teamIndex].roster = players;
      setTeams(newTeams);
      setActiveRoster(teamId);
    } catch (error) {
      console.error("Error cargando roster", error);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Cargando Divisiones...</div>;

  return (
    <div className="min-h-screen pt-52 pb-20 px-4 bg-[#050505] relative">
      
      {/* --- MODAL DE JUGADOR --- */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedPlayer(null)}></div>
          <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row max-h-[90vh]">
            <button onClick={() => setSelectedPlayer(null)} className="absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-full hover:bg-white/20 text-gray-400">
                <X size={24} />
            </button>

            {/* FOTO JUGADOR */}
            <div className="w-full md:w-2/5 relative bg-[#111] min-h-[300px] md:min-h-full group overflow-hidden">
                {selectedPlayer.photo_url ? (
                   <Image src={selectedPlayer.photo_url} alt={selectedPlayer.nickname} fill className="object-cover" />
                ) : (
                   <div className="absolute inset-0 flex items-center justify-center text-gray-700"><User size={120} strokeWidth={0.5} /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-6 left-6 z-10">
                    <p className="text-sk-accent font-bold tracking-widest uppercase text-sm mb-1">{selectedPlayer.role}</p>
                    <h2 className="text-5xl font-black italic text-white uppercase leading-none drop-shadow-lg">{selectedPlayer.nickname}</h2>
                    <p className="text-gray-400 font-mono text-sm mt-2 flex items-center gap-2">
                        <span className="text-xs border border-white/20 px-1 rounded">{selectedPlayer.country}</span> 
                    </p>
                </div>
            </div>

            {/* INFO JUGADOR */}
            <div className="w-full md:w-3/5 p-8 overflow-y-auto custom-scrollbar">
                <div className="mb-8">
                    <h3 className="text-xl font-bold uppercase text-white mb-3 flex items-center gap-2"><span className="w-1 h-6 bg-sk-accent block"></span> Bio</h3>
                    {/* AGREGADO whitespace-pre-line PARA SALTOS DE LÍNEA */}
                    <p className="text-gray-300 leading-relaxed font-light whitespace-pre-line text-justify">
                        {selectedPlayer.bio || "Sin biografía disponible."}
                    </p>
                </div>
                
                {/* Redes Sociales */}
                <div className="flex gap-4 mb-8">
                    {selectedPlayer.socials?.twitch && <a href={selectedPlayer.socials.twitch} target="_blank" className="p-3 bg-[#6441a5]/10 text-[#6441a5] rounded"><Twitch size={20}/></a>}
                    {selectedPlayer.socials?.twitter && <a href={selectedPlayer.socials.twitter} target="_blank" className="p-3 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded"><Twitter size={20}/></a>}
                    {selectedPlayer.socials?.instagram && <a href={selectedPlayer.socials.instagram} target="_blank" className="p-3 bg-[#E1306C]/10 text-[#E1306C] rounded"><Instagram size={20}/></a>}
                </div>

                {/* Setup */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-sm font-bold uppercase text-gray-500 mb-4 tracking-widest">Setup</h4>
                        <div className="space-y-4">
                           {selectedPlayer.setup?.mouse && (
                             <div className="flex items-center gap-3"><MousePointer2 size={18} className="text-gray-500"/> <div><p className="text-[10px] text-gray-500 uppercase">Mouse</p><p className="text-white text-sm">{selectedPlayer.setup.mouse}</p></div></div>
                           )}
                           {selectedPlayer.setup?.keyboard && (
                             <div className="flex items-center gap-3"><Keyboard size={18} className="text-gray-500"/> <div><p className="text-[10px] text-gray-500 uppercase">Teclado</p><p className="text-white text-sm">{selectedPlayer.setup.keyboard}</p></div></div>
                           )}
                           {selectedPlayer.setup?.monitor && (
                             <div className="flex items-center gap-3"><Monitor size={18} className="text-gray-500"/> <div><p className="text-[10px] text-gray-500 uppercase">Monitor</p><p className="text-white text-sm">{selectedPlayer.setup.monitor}</p></div></div>
                           )}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* --- LISTA DE EQUIPOS --- */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic mb-4 tracking-tighter text-white">
            Nuestras <span className="text-sk-accent">Divisiones</span>
          </h1>
          <p className="text-gray-200 max-w-2xl mx-auto text-lg">La vanguardia competitiva de Disp7aceD Network.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map((team) => {
            const isRosterOpen = activeRoster === team.id;
            
            return (
              <div key={team.id} className="group relative h-[500px] border border-white/10 bg-[#111] overflow-hidden hover:border-sk-accent transition-all duration-500 rounded-xl hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col">
                
                {/* IMAGEN DE FONDO */}
                <div className={`absolute inset-0 z-0 transition-all duration-500 ${isRosterOpen ? "opacity-10 blur-sm" : "opacity-100"}`}>
                   {team.image_url && (
                     <Image src={team.image_url} alt={team.name} fill className="object-cover opacity-40 group-hover:opacity-60 grayscale group-hover:grayscale-0 transition-all" />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/50 to-transparent" />
                </div>

                {/* CONTENIDO DE LA TARJETA */}
                <div className={`relative z-10 flex flex-col h-full p-8 transition-all duration-500 ${isRosterOpen ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}`}>
                    <div className={`self-end px-3 py-1 text-[10px] font-bold uppercase tracking-widest border mb-auto ${
                      team.status === "Activo" ? "bg-sk-accent text-white border-sk-accent" : "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                    }`}>
                      {team.status}
                    </div>

                    <h3 className="text-4xl font-black uppercase italic text-white mb-2 group-hover:text-sk-accent transition-colors drop-shadow-lg">{team.name}</h3>
                    <div className="h-1 w-12 bg-sk-accent mb-4 group-hover:w-full transition-all duration-500"></div>
                    <p className="text-gray-200 text-sm leading-relaxed mb-8">{team.description}</p>

                    <div className="mt-auto">
                       <button 
                         onClick={() => toggleRoster(team.id)}
                         className="w-full flex items-center justify-center gap-2 py-3 border border-sk-accent bg-sk-accent/10 text-white font-bold uppercase tracking-wider hover:bg-sk-accent hover:shadow-[0_0_20px_var(--color-sk-accent)] transition-all duration-300 rounded"
                       >
                          Ver Roster <ArrowRight size={16} />
                       </button>
                    </div>
                </div>

                {/* --- ROSTER SLIDE UP --- */}
                <div className={`absolute inset-0 z-20 bg-[#111] flex flex-col transition-all duration-500 p-4 ${isRosterOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                      <h4 className="text-xl font-black uppercase italic text-white">Integrantes</h4>
                      <button onClick={() => toggleRoster(team.id)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                    </div>

                    <div className="flex-grow overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {team.roster && team.roster.length > 0 ? (
                          team.roster.map((player) => (
                             <div 
                                key={player.id} 
                                onClick={() => {
                                   // --- SOLUCIÓN AQUÍ: Convertimos el texto JSON a Objeto real ---
                                   const safeParse = (data: any) => {
                                      try { return typeof data === 'string' ? JSON.parse(data) : (data || {}); } 
                                      catch (e) { return {}; }
                                   };
                                   
                                   setSelectedPlayer({
                                      ...player,
                                      socials: safeParse(player.socials),
                                      setup: safeParse(player.setup)
                                   });
                                }} 
                                className="flex items-center gap-4 bg-white/5 p-3 rounded hover:bg-white/10 transition-colors border border-transparent hover:border-sk-accent/30 group/player cursor-pointer"
                             >
                                <div className="w-12 h-12 rounded bg-black overflow-hidden relative border border-white/10 shrink-0">
                                   {player.photo_url ? (
                                      <Image src={player.photo_url} alt={player.nickname} fill className="object-cover" />
                                   ) : (
                                      <div className="absolute inset-0 flex items-center justify-center text-gray-600 group-hover/player:text-sk-accent"><User size={20} /></div>
                                   )}
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-lg font-black uppercase italic text-white leading-none group-hover/player:text-sk-accent">{player.nickname}</span>
                                   <span className="text-xs text-sk-accent font-bold tracking-widest uppercase">{player.role}</span>
                                </div>
                             </div>
                          ))
                      ) : (
                          <div className="h-full flex items-center justify-center text-gray-500 text-sm">Cargando o sin jugadores...</div>
                      )}
                    </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}