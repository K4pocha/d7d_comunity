"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Trophy, Calendar, Gamepad2 } from "lucide-react";
import TournamentBracket from "@/src/components/TournamentBracket";

export default function TournamentDetail() {
  const { id } = useParams();
  const [tournament, setTournament] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/tournaments?id=${id}`)
      .then(res => res.json())
      .then(data => {
         // Parseamos el JSON del bracket porque viene como string de la BD
         if (typeof data.bracket_data === 'string') {
             data.bracket_data = JSON.parse(data.bracket_data);
         }
         setTournament(data);
      });
  }, [id]);

  if (!tournament) return <div className="min-h-screen bg-[#050505] pt-40 text-center text-white">Cargando...</div>;

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header del Torneo */}
        <div className="text-center mb-16">
            <span className="bg-sk-accent text-black font-black text-xs px-3 py-1 rounded uppercase tracking-widest mb-4 inline-block">
                {tournament.status}
            </span>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase text-white mb-6 drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">
                {tournament.title}
            </h1>
            <div className="flex justify-center gap-8 text-gray-400 font-bold uppercase text-sm">
                <span className="flex items-center gap-2"><Gamepad2 size={18} className="text-sk-accent"/> {tournament.game}</span>
                <span className="flex items-center gap-2"><Calendar size={18} className="text-sk-accent"/> {new Date(tournament.start_date).toLocaleDateString()}</span>
            </div>
        </div>

        {/* BRACKET VISUAL */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 md:p-8 overflow-x-auto shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sk-accent to-transparent opacity-50"></div>
            <h2 className="text-2xl font-black uppercase italic text-white mb-8 flex items-center gap-3">
                <Trophy className="text-yellow-500" /> Fase Eliminatoria
            </h2>
            
            <TournamentBracket data={tournament.bracket_data} />
        </div>

      </div>
    </div>
  );
}