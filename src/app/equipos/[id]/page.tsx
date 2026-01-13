import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trophy, Swords, Users, Crown, Shield } from "lucide-react";
import { pool } from "../../../lib/db"; // Importamos conexión directa

// Tipos para TypeScript
type TeamData = {
    id: number;
    name: string;
    slug: string;
    status: string;
    description: string;
    image_url: string;
};

type PlayerData = {
    id: number;
    nickname: string;
    role: string;
    country: string;
};

// Obtener datos directamente de la BD
async function getTeamBySlug(slug: string) {
    // 1. Obtener el juego
    const [rows]: any = await pool.query('SELECT * FROM games WHERE slug = ?', [slug]);
    if (rows.length === 0) return null;
    const team = rows[0] as TeamData;

    // 2. Obtener sus jugadores
    const [roster]: any = await pool.query('SELECT * FROM roster WHERE game_id = ?', [team.id]);
    
    return { ...team, roster: roster as PlayerData[] };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const team = await getTeamBySlug(id); // 'id' aquí es el slug (ej: lol)
    if (!team) return { title: "Equipo no encontrado" };
    return {
        title: `${team.name} Roster | D7D Network`,
        description: team.description,
    };
}

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // El "id" de la URL es el slug (ej: 'lol')
    const team = await getTeamBySlug(id);

    if (!team) notFound();

    return (
        <div className="min-h-screen bg-[#050505] pb-20">
             {/* HEADER HERO */}
            <div className="relative h-[60vh] w-full">
                {team.image_url && (
                    <Image src={team.image_url} alt={team.name} fill className="object-cover opacity-30" priority />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pt-20">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-[#111] rounded-2xl border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] mb-6 animate-fade-in-up">
                        <Trophy size={48} className="text-white" />
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black uppercase italic text-white tracking-tighter mb-4 drop-shadow-lg">
                        {team.name}
                    </h1>

                    <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/10 bg-black/50 backdrop-blur ${team.status === "Reclutando" ? "text-sk-accent border-sk-accent" : "text-gray-400"}`}>
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-widest">{team.status}</span>
                    </div>
                </div>

                <div className="absolute top-24 left-4 md:left-8 z-20">
                    <Link href="/equipos" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest bg-black/20 p-2 rounded-lg backdrop-blur">
                        <ArrowLeft size={16} /> Volver
                    </Link>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* INFO SIDEBAR */}
                    <div className="space-y-6">
                        <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                            <h3 className="text-white font-black uppercase italic text-xl mb-6 flex items-center gap-2">
                                <Shield className="text-sk-accent" size={20} /> Info de Squad
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-white/5 pb-3">
                                    <span className="text-gray-500 text-sm uppercase font-bold">Región</span>
                                    <span className="text-white font-mono">LATAM</span>
                                </div>
                                {/* Puedes añadir campos de Coach o Torneos a la DB si quieres mostrarlos aquí */}
                            </div>
                            <div className="mt-8">
                                <button className="w-full py-3 bg-white/5 hover:bg-sk-accent hover:text-black text-white font-bold uppercase tracking-wider rounded border border-white/10 transition-all flex items-center justify-center gap-2">
                                    <Swords size={18} /> Desafiar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ROSTER LIST */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-8 min-h-[400px]">
                            <h3 className="text-white font-black uppercase italic text-3xl mb-2">Active Roster</h3>
                            <p className="text-gray-400 mb-8">Jugadores titulares.</p>

                            {team.roster && team.roster.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {team.roster.map((player, index) => (
                                        <div key={index} className="group flex items-center gap-4 p-4 bg-[#111] border border-white/5 rounded-lg hover:border-sk-accent transition-all cursor-pointer">
                                            <div className="w-16 h-16 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-gray-600 group-hover:text-sk-accent group-hover:bg-sk-accent/10 transition-colors">
                                                <Users size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-white font-black text-xl italic uppercase group-hover:text-sk-accent transition-colors">
                                                        {player.nickname}
                                                    </h4>
                                                    {index === 0 && <Crown size={14} className="text-yellow-500" />}
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
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}