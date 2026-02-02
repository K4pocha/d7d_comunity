"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy, Calendar, ArrowRight, Gamepad2, Layout } from "lucide-react";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tournaments')
      .then(res => res.json())
      .then(data => {
        setTournaments(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] pt-40 flex flex-col items-center justify-center text-white gap-4">
        <Layout className="animate-pulse text-sk-accent" size={48} />
        <p className="uppercase tracking-widest text-sm font-bold">Cargando Torneos...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] pt-36 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black uppercase italic text-white mb-4 tracking-tighter">
              Torneos <span className="text-sk-accent">Oficiales</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Compite, demuestra tu nivel y gana premios en nuestras ligas oficiales.
            </p>
        </div>

        {/* Lista de Torneos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.length > 0 ? (
                tournaments.map((t) => (
                    <Link key={t.id} href={`/torneos/${t.id}`} className="group bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-sk-accent hover:-translate-y-2 transition-all duration-300 flex flex-col">
                        {/* Header Tarjeta */}
                        <div className="h-32 bg-gradient-to-br from-gray-900 to-black p-6 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Trophy size={80} />
                            </div>
                            <span className={`self-start px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${
                                t.status === 'En Curso' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                                t.status === 'Inscripciones' ? 'bg-sk-accent/10 text-sk-accent border-sk-accent/20' : 
                                'bg-gray-800 text-gray-500 border-white/10'
                            }`}>
                                {t.status}
                            </span>
                        </div>
                        
                        {/* Body Tarjeta */}
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-2xl font-black italic uppercase text-white mb-2 leading-none group-hover:text-sk-accent transition-colors">
                                {t.title}
                            </h3>
                            
                            <div className="mt-auto space-y-3 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase">
                                    <Gamepad2 size={14} className="text-sk-accent"/> {t.game}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase">
                                    <Calendar size={14} className="text-sk-accent"/> {new Date(t.start_date).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="mt-6 w-full py-3 rounded bg-white/5 group-hover:bg-sk-accent group-hover:text-black text-white font-bold uppercase text-xs tracking-widest text-center transition-all flex items-center justify-center gap-2">
                                Ver Bracket <ArrowRight size={14}/>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="col-span-3 text-center py-20 border border-dashed border-white/10 rounded-xl">
                    <Trophy size={48} className="mx-auto text-gray-600 mb-4"/>
                    <p className="text-gray-500 uppercase tracking-widest font-bold">No hay torneos activos</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}