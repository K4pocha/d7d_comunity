import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trophy, Swords, Users, Crown, Shield } from "lucide-react";
import teamsData from "../../../data/equipos.json";

// SEO Dinámico
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const team = teamsData.find((t) => t.id === id);
    if (!team) return { title: "Equipo no encontrado" };
    return {
        title: `${team.game} Roster | D7D Network`,
        description: team.description,
    };
}

// Generación Estática (Carga instantánea)
export async function generateStaticParams() {
    return teamsData.map((t) => ({ id: t.id }));
}

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const team = teamsData.find((t) => t.id === id);

    if (!team) notFound();

    return (
        <div className="min-h-screen bg-[#050505] pb-20">

            {/* --- HEADER HERO --- */}
            <div className="relative h-[60vh] w-full">
                <Image
                    src={team.image}
                    alt={team.game}
                    fill
                    className="object-cover opacity-30"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />

                {/* Contenido Header */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pt-20">
                    {/* Logo Flotante */}
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-[#111] rounded-2xl border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] mb-6 animate-fade-in-up">
                        {/* Aquí iría <Image> del logo si son distintos, por ahora texto o icono */}
                        <Trophy size={48} className="text-white" />
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black uppercase italic text-white tracking-tighter mb-4 drop-shadow-lg">
                        {team.game}
                    </h1>

                    <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/10 bg-black/50 backdrop-blur ${team.status === "RECLUTANDO" ? "text-sk-accent border-sk-accent" : "text-gray-400"
                        }`}>
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-widest">{team.status}</span>
                    </div>
                </div>

                {/* Botón Volver */}
                <div className="absolute top-24 left-4 md:left-8 z-20">
                    <Link href="/equipos" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest bg-black/20 p-2 rounded-lg backdrop-blur">
                        <ArrowLeft size={16} /> Volver
                    </Link>
                </div>
            </div>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">

                {/* Grid de Información */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* COLUMNA IZQUIERDA: Stats & Info */}
                    <div className="space-y-6">
                        <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                            <h3 className="text-white font-black uppercase italic text-xl mb-6 flex items-center gap-2">
                                <Shield className="text-sk-accent" size={20} /> Info de Squad
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-white/5 pb-3">
                                    <span className="text-gray-500 text-sm uppercase font-bold">Coach</span>
                                    <span className="text-white font-mono">{team.coach}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-3">
                                    <span className="text-gray-500 text-sm uppercase font-bold">Región</span>
                                    <span className="text-white font-mono">LATAM Sur</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-3">
                                    <span className="text-gray-500 text-sm uppercase font-bold">Torneos</span>
                                    <span className="text-sk-accent font-mono">0 (Pre-Season)</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button className="w-full py-3 bg-white/5 hover:bg-sk-accent hover:text-black text-white font-bold uppercase tracking-wider rounded border border-white/10 transition-all flex items-center justify-center gap-2">
                                    <Swords size={18} /> Desafiar (Scrim)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: Roster (Jugadores) */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-8 min-h-[400px]">
                            <h3 className="text-white font-black uppercase italic text-3xl mb-2">Active Roster</h3>
                            <p className="text-gray-400 mb-8">Jugadores titulares para la temporada 2026.</p>

                            {team.roster && team.roster.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {team.roster.map((player: any, index: number) => (
                                        <div key={index} className="group flex items-center gap-4 p-4 bg-[#111] border border-white/5 rounded-lg hover:border-sk-accent transition-all cursor-pointer">
                                            {/* Avatar Placeholder */}
                                            <div className="w-16 h-16 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-gray-600 group-hover:text-sk-accent group-hover:bg-sk-accent/10 transition-colors">
                                                <Users size={24} />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-white font-black text-xl italic uppercase group-hover:text-sk-accent transition-colors">
                                                        {player.nick}
                                                    </h4>
                                                    {index === 0 && (
                                                        <span title="Capitán" className="cursor-help">
                                                            <Crown size={14} className="text-yellow-500" />
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                                                    {player.role} • {player.country}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                                    <Users size={48} className="text-gray-600 mb-4" />
                                    <p className="text-gray-400 text-lg font-bold">Roster en construcción</p>
                                    {team.status === "RECLUTANDO" && (
                                        <Link href="/registro" className="mt-4 text-sk-accent uppercase font-bold text-sm hover:underline">
                                            ¡Postúlate aquí!
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}