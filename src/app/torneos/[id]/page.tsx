"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
    Trophy, 
    Calendar, 
    Gamepad2, 
    Map as MapIcon, 
    Users, 
    ScrollText, 
    Star, 
    Medal,
    Ticket,
    Handshake
} from "lucide-react";
import TournamentBracket from "@/src/components/TournamentBracket";

// Componente reutilizable para las tarjetas de información
const InfoCard = ({ title, icon: Icon, children, className = "", bgClass = "bg-[#0a0a0a]" }: any) => (
  <div className={`${bgClass} border border-white/10 rounded-2xl p-5 md:p-6 relative overflow-hidden shadow-xl ${className}`}>
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sk-accent to-transparent opacity-50"></div>
    <h3 className="text-xl font-black uppercase italic text-white mb-5 flex items-center gap-3 drop-shadow-md">
      <Icon className="text-sk-accent" size={22} /> {title}
    </h3>
    {children}
  </div>
);

// Componente para los items de detalles
const DetailItem = ({ label, value }: { label: string, value: string | number }) => (
    <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex flex-col justify-center">
        <span className="block text-xs text-gray-400 uppercase font-bold mb-1">{label}</span>
        <span className="block text-sm text-white font-medium">{value}</span>
    </div>
);

// Datos de prueba para el Top 10
const top10Ranking = [
    { name: "k4pocha", pts: 150, trn: 5, w: 12, mvp: 3, rep: "+95" },
    { name: "PlayerTwo", pts: 120, trn: 4, w: 8, mvp: 1, rep: "+80" },
    { name: "SniperPro", pts: 105, trn: 4, w: 7, mvp: 2, rep: "+75" },
    { name: "RushB", pts: 90, trn: 3, w: 6, mvp: 0, rep: "+85" },
    { name: "ToxicBoy", pts: 85, trn: 5, w: 5, mvp: 1, rep: "-10" },
    { name: "HealerGod", pts: 80, trn: 3, w: 6, mvp: 2, rep: "+99" },
    { name: "NoScope", pts: 75, trn: 2, w: 5, mvp: 1, rep: "+50" },
    { name: "Lagger", pts: 60, trn: 4, w: 3, mvp: 0, rep: "+20" },
    { name: "CarryMe", pts: 55, trn: 2, w: 4, mvp: 0, rep: "+45" },
    { name: "BotJuan", pts: 40, trn: 1, w: 2, mvp: 0, rep: "+10" },
];

export default function TournamentDetail() {
  const { id } = useParams();
  const [tournament, setTournament] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/tournaments?id=${id}`)
      .then(res => res.json())
      .then(data => {
         if (typeof data.bracket_data === 'string') {
             data.bracket_data = JSON.parse(data.bracket_data);
         }
         setTournament(data);
      });
  }, [id]);

  if (!tournament) return <div className="min-h-screen bg-[#050505] pt-40 text-center text-white font-bold">Cargando información del torneo...</div>;

  return (
    // Aumenté el padding top (pt-32 md:pt-40) para separar la imagen de la navbar
    <div className="min-h-screen bg-[#050505] pt-32 md:pt-40 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* HERO BANNER DEL TORNEO */}
        <div className="relative w-full h-[350px] md:h-[450px] rounded-3xl overflow-hidden mb-12 flex flex-col justify-end items-center text-center border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: `url(${tournament.banner_url || '/valo-fondo.png'})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent"></div>

            <div className="relative z-10 px-4 w-full max-w-4xl mx-auto pb-12">
                <span className="bg-sk-accent text-black font-black text-xs md:text-sm px-4 py-1.5 rounded uppercase tracking-widest mb-4 inline-block shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    {tournament.status || "En Curso"}
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase text-white mb-6 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] leading-tight">
                    {tournament.title}
                </h1>
                
                {/* Pastilla de info flotante - Reemplazada fecha por Costo de Inscripción */}
                <div className="flex justify-center items-center gap-6 md:gap-10 text-gray-200 font-bold uppercase text-sm md:text-base bg-black/50 w-fit mx-auto px-6 py-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
                    <span className="flex items-center gap-2">
                        <Gamepad2 size={20} className="text-sk-accent"/> 
                        {tournament.game || "Valorant"}
                    </span>
                    <span className="w-px h-6 bg-white/20"></span> {/* Separador */}
                    {/* Badge de Inscripción destacado en verde */}
                    <span className="flex items-center gap-2 bg-green-500 text-black px-3 py-1 rounded shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                        <Ticket size={20}/> 
                        {tournament.entry_fee || "GRATIS"}
                    </span>
                </div>
            </div>
        </div>

        {/* CONTENIDO DEL TORNEO - GRILLA DE INFORMACIÓN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            
            {/* Columna Izquierda (Más ancha) */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Detalles del Torneo */}
                <InfoCard title="Detalles del Torneo" icon={Gamepad2}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <DetailItem label="Juego" value={tournament.game || "Valorant"} />
                        <DetailItem label="Fecha Inicio" value={tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : "15-03-2024"} />
                        <DetailItem label="Hora" value="20:00 CL" />
                        <DetailItem label="Formato" value={tournament.format || "BO3"} />
                        <DetailItem label="Modo" value={tournament.mode || "5v5"} />
                        <DetailItem label="Cupos" value={tournament.slots || "12 / 16"} />
                        <DetailItem label="Región" value={tournament.region || "LATAM"} />
                        <DetailItem label="Tipo" value={tournament.type || "Double Elimination"} />
                    </div>
                </InfoCard>

                {/* Reglas del Torneo (Renombrado de Términos y Condiciones) */}
                <InfoCard title="Reglas del Torneo" icon={ScrollText}>
                    <div className="bg-black/40 border border-white/5 p-5 rounded-xl h-[280px] overflow-y-auto text-gray-400 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        <p className="mb-4 text-white font-bold">Estas son las reglas específicas de esta competencia. Para normativas generales de la comunidad, revisa nuestros Términos y Condiciones oficiales.</p>
                        <p className="mb-4">
                            <strong>1. Comportamiento:</strong> Se espera que todos los jugadores mantengan una actitud deportiva. El uso de cheats, exploits o insultos resultará en descalificación inmediata.
                        </p>
                        <p className="mb-4">
                            <strong>2. Check-in:</strong> Los equipos deben realizar el check-in 30 minutos antes del inicio del primer partido. Si un equipo no se presenta 10 minutos después de la hora oficial, perderá por W.O.
                        </p>
                        <p className="mb-4">
                            <strong>3. Desconexiones:</strong> Si un jugador se desconecta antes de la primera kill, se reiniciará la ronda. Si es después, el juego continúa o se usa pausa táctica según el reglamento del juego.
                        </p>
                        <p className="mb-4">
                            <strong>4. Formato de las Partidas:</strong> Todas las rondas iniciales se jugarán al mejor de 1 (BO1). Las semifinales y la Gran Final se jugarán al mejor de 3 (BO3).
                        </p>
                    </div>
                </InfoCard>

                {/* Participantes */}
                <InfoCard 
                    title="Participantes Inscritos" 
                    icon={Users} 
                    bgClass="bg-[url('/fondo.jpg')] bg-cover bg-center bg-blend-overlay bg-[#050505]/95"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {["Leviatán", "KRÜ Esports", "Furious", "9z Team", "Faze", "Sentinels", "Cloud9", "LOUD"].map((equipo) => (
                            <div key={equipo} className="bg-black/60 border border-white/10 p-3 rounded-xl text-center backdrop-blur-md hover:border-sk-accent/50 hover:bg-white/5 transition-all cursor-default shadow-md">
                                <span className="text-sm font-black text-white">{equipo}</span>
                            </div>
                        ))}
                    </div>
                </InfoCard>

            </div>

            {/* Columna Derecha (Widgets) */}
            <div className="space-y-6">
                
                {/* Premios */}
                <InfoCard title="Prize Pool" icon={Medal}>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-[#111] border border-yellow-500/20 px-4 py-3 rounded-xl shadow-lg">
                            <span className="text-yellow-500 font-bold flex items-center gap-2"><Trophy size={18}/> 1° Lugar</span>
                            <span className="text-white font-black text-lg">{tournament.prize_1 || "$100 USD"}</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#111] border border-gray-400/20 px-4 py-3 rounded-xl shadow-lg">
                            <span className="text-gray-400 font-bold flex items-center gap-2"><Trophy size={18}/> 2° Lugar</span>
                            <span className="text-white font-black text-lg">{tournament.prize_2 || "$50 USD"}</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#111] border border-orange-500/20 px-4 py-3 rounded-xl shadow-lg">
                            <span className="text-orange-500 font-bold flex items-center gap-2"><Trophy size={18}/> 3° Lugar</span>
                            <span className="text-white font-black text-lg">{tournament.prize_3 || "$25 USD"}</span>
                        </div>
                    </div>
                </InfoCard>

                {/* Sección de Sponsors */}
                <div className="bg-[#111] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-3">
                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-2">
                        <Handshake size={14} className="text-sk-accent" /> Sponsored By
                    </span>
                    <div className="flex gap-6 items-center opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
                        <span className="text-white font-black italic text-xl tracking-tighter">RED BULL</span>
                        <span className="text-white font-bold text-xl">intel</span>
                    </div>
                </div>

                {/* Map Pool */}
                <InfoCard title="Map Pool" icon={MapIcon}>
                    <div className="flex flex-wrap gap-2">
                        {["Ascent", "Bind", "Haven", "Split", "Icebox"].map((mapa) => (
                            <span key={mapa} className="bg-black/50 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-lg text-sm font-bold text-gray-300 hover:text-sk-accent hover:border-sk-accent/50 transition-all cursor-default">
                                {mapa}
                            </span>
                        ))}
                    </div>
                </InfoCard>

                {/* Ranking del Torneo - Ahora Top 10 */}
                <InfoCard title="Top 10 del Torneo" icon={Star}>
                    <div className="overflow-x-auto h-[300px] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] md:text-xs text-gray-500 uppercase font-black border-b border-white/10 sticky top-0 bg-[#0a0a0a] z-10">
                                <tr>
                                    <th className="py-2">#</th>
                                    <th className="py-2">Jugador</th>
                                    <th className="py-2 text-center">Pts</th>
                                    <th className="py-2 text-center hidden md:table-cell">W</th>
                                </tr>
                            </thead>
                            <tbody>
                                {top10Ranking.map((player, index) => (
                                    <tr key={player.name} className="border-b border-white/5 text-gray-300 hover:bg-white/5 transition-colors">
                                        <td className="py-3 font-bold text-gray-500">{index + 1}</td>
                                        <td className={`py-3 font-bold ${index < 3 ? 'text-white' : 'text-gray-400'}`}>{player.name}</td>
                                        <td className={`py-3 text-center font-black ${index === 0 ? 'text-yellow-500' : 'text-sk-accent'}`}>{player.pts}</td>
                                        <td className="py-3 text-center hidden md:table-cell">{player.w}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </InfoCard>

            </div>
        </div>

        {/* BRACKET VISUAL */}
        <InfoCard title="Fase Eliminatoria" icon={Trophy} className="overflow-x-auto p-2 md:p-6">
            <TournamentBracket data={tournament.bracket_data} />
        </InfoCard>

      </div>
    </div>
  );
}