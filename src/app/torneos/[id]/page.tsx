"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import TournamentBracket from "../../../components/TournamentBracket";
import { Trophy, Calendar, Users, Gamepad2, Gift, Award } from "lucide-react";

export default function TorneoDetalle() {
  const { id } = useParams();
  const [torneo, setTorneo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    // Aquí conectarás con tu API real: fetch(`/api/tournaments/${id}`)
    setTorneo({
      id,
      title: "Liga de Verano Valorant",
      game: "Valorant",
      start_date: "2024-03-15",
      format: "BO3",
      max_slots: 16,
      current_slots: 12,
      status: "Inscripciones Abiertas",
      sponsor: "Logitech G",
      prizes: [
        { pos: "1er Lugar", desc: "$100 USD + Periféricos" },
        { pos: "2do Lugar", desc: "$50 USD" }
      ],
      participantes: ["Equipo Alpha", "Beta Squad", "Gamma Team", "Delta Force"],
      bracket_data: {
        rounds: [
            { name: "Semifinal", matches: [ {p1:"Equipo Alpha", p2:"Beta Squad", s1:0, s2:0}, {p1:"Gamma Team", p2:"Delta Force", s1:0, s2:0} ] },
            { name: "Final", matches: [ {p1:"TBD", p2:"TBD", s1:0, s2:0} ] }
        ]
      }
    });
  }, [id]);

  if (!torneo) return <div className="min-h-screen flex items-center justify-center text-white bg-black">Cargando...</div>;

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-4 md:px-10 pb-20">
      
      {/* HEADER DEL TORNEO */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Trophy size={120} />
        </div>
        <span className="bg-sk-accent/20 text-sk-accent text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block uppercase">
          {torneo.status}
        </span>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-2">{torneo.title}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* COLUMNA PRINCIPAL (75%) */}
        <div className="lg:w-3/4 space-y-6">
          <div className="flex gap-6 border-b border-white/10 pb-2 overflow-x-auto">
            {["info", "bracket", "participantes"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm md:text-base font-bold uppercase tracking-widest pb-2 transition-colors whitespace-nowrap ${activeTab === tab ? "text-sk-accent border-b-2 border-sk-accent -mb-[9px]" : "text-gray-500 hover:text-white"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-[#111] border border-white/10 rounded-xl p-6 min-h-[400px]">
            {activeTab === "info" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold border-b border-white/10 pb-4">Detalles del Torneo</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-gray-500 text-xs uppercase font-bold flex items-center gap-1"><Gamepad2 size={14}/> Juego</span>
                    <span className="font-bold">{torneo.game}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-gray-500 text-xs uppercase font-bold flex items-center gap-1"><Calendar size={14}/> Fecha</span>
                    <span className="font-bold">{torneo.start_date}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-gray-500 text-xs uppercase font-bold flex items-center gap-1"><Award size={14}/> Formato</span>
                    <span className="font-bold">{torneo.format}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-gray-500 text-xs uppercase font-bold flex items-center gap-1"><Users size={14}/> Cupos</span>
                    <span className="font-bold">{torneo.current_slots} / {torneo.max_slots}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bracket" && (
              <div>
                <h3 className="text-2xl font-bold border-b border-white/10 pb-4 mb-6">Cuadro del Torneo</h3>
                <TournamentBracket data={torneo.bracket_data} />
              </div>
            )}

            {activeTab === "participantes" && (
              <div>
                <h3 className="text-2xl font-bold border-b border-white/10 pb-4 mb-6">Equipos Inscritos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {torneo.participantes.map((p: string, i: number) => (
                    <div key={i} className="bg-black border border-white/10 p-4 rounded text-center font-bold hover:border-sk-accent transition-colors">
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BARRA LATERAL (25%) */}
        <div className="lg:w-1/4 space-y-6">
          <div className="bg-[#111] border border-sk-accent/30 rounded-xl p-6 text-center shadow-[0_0_15px_rgba(var(--sk-accent-rgb),0.1)]">
            <h3 className="text-xl font-black uppercase mb-2">¡Únete a la Batalla!</h3>
            <p className="text-sm text-gray-400 mb-6">Cupos restantes: <span className="text-white font-bold">{torneo.max_slots - torneo.current_slots}</span></p>
            <button className="w-full bg-sk-accent text-black font-black uppercase py-4 rounded-lg hover:bg-white transition-colors">
              Inscribirse al Torneo
            </button>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold uppercase mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
              <Gift className="text-yellow-400" /> Premios
            </h3>
            <ul className="space-y-4 mb-6">
              {torneo.prizes.map((prize: any, i: number) => (
                <li key={i} className="flex flex-col bg-black/50 p-3 rounded border border-white/5">
                  <span className="text-sk-accent text-xs font-bold uppercase">{prize.pos}</span>
                  <span className="text-sm font-bold">{prize.desc}</span>
                </li>
              ))}
            </ul>

            {torneo.sponsor && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <span className="text-xs text-gray-500 uppercase font-bold block mb-2">Sponsor Oficial</span>
                <div className="bg-black border border-white/5 py-3 rounded text-center font-bold text-gray-300">
                  {torneo.sponsor}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}