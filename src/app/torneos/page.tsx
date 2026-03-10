"use client";
import { useState } from "react";
import Link from "next/link";
import { Trophy, Calendar, CheckCircle } from "lucide-react";

export default function EventosPage() {
  const [activeTab, setActiveTab] = useState("torneos");
  // Aquí luego cargarás desde /api/tournaments
  // const [torneos, setTorneos] = useState([]);

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-4 md:px-10 pb-20">
      
      {/* MENÚ PRINCIPAL DE EVENTOS */}
      <div className="flex justify-center gap-8 border-b border-white/10 mb-10 pb-4 overflow-x-auto whitespace-nowrap">
        <button 
          onClick={() => setActiveTab("torneos")}
          className={`text-xl font-black uppercase tracking-widest transition-colors ${activeTab === "torneos" ? "text-sk-accent border-b-2 border-sk-accent pb-4 -mb-[18px]" : "text-gray-500 hover:text-white"}`}
        >
          Torneos
        </button>
        <button 
          onClick={() => setActiveTab("ranking")}
          className={`text-xl font-black uppercase tracking-widest transition-colors ${activeTab === "ranking" ? "text-sk-accent border-b-2 border-sk-accent pb-4 -mb-[18px]" : "text-gray-500 hover:text-white"}`}
        >
          Ranking
        </button>
        <button 
          onClick={() => setActiveTab("tyc")}
          className={`text-xl font-black uppercase tracking-widest transition-colors ${activeTab === "tyc" ? "text-sk-accent border-b-2 border-sk-accent pb-4 -mb-[18px]" : "text-gray-500 hover:text-white"}`}
        >
          Términos y Condiciones
        </button>
      </div>

      {/* CONTENIDO DE LA PESTAÑA: TORNEOS */}
      {activeTab === "torneos" && (
        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Trophy className="text-sk-accent"/> Torneos Activos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/torneos/1" className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-sk-accent transition-all group">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded mb-3 inline-block">EN JUEGO</span>
                    <h3 className="text-xl font-bold group-hover:text-sk-accent transition-colors">Liga de Verano Valorant</h3>
                    <p className="text-gray-400 text-sm mt-2">Formato: BO3 | 16/16 Equipos</p>
                </Link>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Calendar className="text-blue-400"/> Próximos Torneos</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/torneos/2" className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-blue-400 transition-all group">
                    <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-1 rounded mb-3 inline-block">INSCRIPCIONES ABIERTAS</span>
                    <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">Torneo Relámpago CS2</h3>
                    <p className="text-gray-400 text-sm mt-2">Inicia: 15 de Marzo | Cupos: 8/16</p>
                </Link>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-400"><CheckCircle /> Historial de Torneos</h2>
            {/* Aquí mapeas los torneos "Finalizados" */}
            <p className="text-gray-500 italic">No hay torneos finalizados aún.</p>
          </section>
        </div>
      )}

      {/* CONTENIDO DE LA PESTAÑA: RANKING */}
      {activeTab === "ranking" && (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <h2 className="text-3xl font-black text-sk-accent uppercase tracking-wider flex items-center gap-2">
              <Trophy /> Ranking Competitivo
            </h2>
            <select className="bg-[#111] border border-white/20 text-white p-3 rounded-lg outline-none font-bold uppercase focus:border-sk-accent transition-colors">
              <option value="valorant">Valorant</option>
              <option value="rocketleague">Rocket League</option>
              <option value="deltaforce">Delta Force</option>
              <option value="cs2">CS2</option>
            </select>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-black/50 text-gray-400 text-xs uppercase tracking-widest border-b border-white/10">
                  <th className="p-4 font-bold w-16 text-center">#</th>
                  <th className="p-4 font-bold">Jugador / Equipo</th>
                  <th className="p-4 font-bold text-center">Puntos</th>
                  <th className="p-4 font-bold text-center">Torneos</th>
                  <th className="p-4 font-bold text-center">Wins</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-center font-black text-yellow-400">1</td>
                  <td className="p-4 font-bold text-white">PlayerX</td>
                  <td className="p-4 text-center font-mono text-sk-accent font-bold">120</td>
                  <td className="p-4 text-center text-gray-400">5</td>
                  <td className="p-4 text-center text-gray-400">3</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-center font-black text-gray-300">2</td>
                  <td className="p-4 font-bold text-white">PlayerY</td>
                  <td className="p-4 text-center font-mono text-sk-accent font-bold">90</td>
                  <td className="p-4 text-center text-gray-400">4</td>
                  <td className="p-4 text-center text-gray-400">2</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-center font-black text-orange-400">3</td>
                  <td className="p-4 font-bold text-white">Team Gamma</td>
                  <td className="p-4 text-center font-mono text-sk-accent font-bold">75</td>
                  <td className="p-4 text-center text-gray-400">4</td>
                  <td className="p-4 text-center text-gray-400">1</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end mt-4">
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-colors">
              Exportar a CSV
            </button>
          </div>
        </div>
      )}

      {/* CONTENIDO DE LA PESTAÑA: TÉRMINOS Y CONDICIONES */}
      {activeTab === "tyc" && (
        <div className="max-w-3xl mx-auto prose prose-invert bg-[#111] p-8 rounded-xl border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-sk-accent">Reglamento General</h2>
          <p className="text-gray-300 mb-4">
            Al participar en los torneos organizados por la comunidad, los jugadores aceptan adherirse a las reglas de comportamiento y espíritu competitivo.
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>Respeto mutuo entre todos los participantes.</li>
            <li>Prohibido el uso de software de terceros o ventajas desleales (cheats).</li>
            <li>En caso de desconexión, se aplicarán las reglas específicas de cada juego.</li>
            <li>Las decisiones de los administradores son definitivas.</li>
          </ul>
        </div>
      )}

    </div>
  );
}