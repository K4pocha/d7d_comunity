"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// TUS DATOS EXACTOS
const TEAMS = [
  {
    game: "League of Legends",
    status: "PROXIMAMENTE",
    description: "División de League of Legends enfocada en alto rendimiento, disciplina y ejecución competitiva.",
    image: "/fondo.jpg", 
    logo: "/games/lol-logo.png"
  },
  {
    game: "Valorant",
    status: "RECLUTANDO",
    description: "Equipo de Valorant orientado a precisión táctica, control total y mentalidad ganadora.",
    image: "/fondo.jpg",
    logo: "/games/val-logo.png"
  },
  {
    game: "CS2",
    status: "PROXIMAMENTE",
    description: "División de CS2 basada en ejecución precisa, estrategia avanzada y consistencia competitiva.",
    image: "/fondo.jpg",
    logo: "/games/cs2-logo.png"
  },
  {
    game: "Delta Force",
    status: "RECLUTANDO",
    description: "División de Delta Force centrada en táctica militar, coordinación extrema y control del campo.",
    image: "/fondo.jpg",
    logo: "/games/delta-logo.png"
  },
  {
    game: "Rocket League",
    status: "PROXIMAMENTE",
    description: "Equipo de Rocket League enfocado en velocidad, precisión mecánica y dominio competitivo.",
    image: "/fondo.jpg",
    logo: "/games/rl-logo.png"
  },
  {
    game: "Creadores de Contenido",
    status: "RECLUTANDO",
    description: "Creadores de contenido enfocados en marca, constancia y proyección profesional.",
    image: "/fondo.jpg",
    logo: "/games/camera-logo.png"
  }
];

export default function EquiposPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-[#050505]">
      
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic mb-4 tracking-tighter text-white">
            Nuestras <span className="text-sk-accent">Divisiones</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            La vanguardia competitiva de Disp7aceD Network.
          </p>
        </div>

        {/* GRID DE EQUIPOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAMS.map((team, index) => (
            <div key={index} className="group relative h-[450px] border border-white/10 bg-[#111] overflow-hidden hover:border-sk-accent transition-all duration-500 rounded-xl hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              
              {/* FONDO DE LA TARJETA */}
              <div className="absolute inset-0 z-0">
                <Image 
                    src={team.image} 
                    alt={team.game} 
                    fill 
                    className="object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500 grayscale group-hover:grayscale-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
              </div>

              {/* CONTENIDO SUPERPUESTO */}
              <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                
                {/* BADGE DE ESTADO (Inclinado) */}
                <div className={`absolute top-6 right-6 px-4 py-1 text-xs font-bold uppercase tracking-widest skew-x-[-12deg] transition-all duration-300 border border-transparent ${
                  team.status === "RECLUTANDO" 
                  ? "bg-sk-accent text-white shadow-[0_0_15px_var(--color-sk-accent)] border-sk-accent" 
                  : "bg-black/50 text-gray-500 border-white/10"
                }`}>
                  <span className="block skew-x-[12deg]">{team.status}</span>
                </div>

                {/* NOMBRE DEL JUEGO */}
                <h3 className="text-4xl font-black uppercase italic text-white mb-2 group-hover:text-sk-accent transition-colors drop-shadow-lg">
                  {team.game}
                </h3>
                
                {/* LÍNEA DECORATIVA ANIMADA */}
                <div className="h-1 w-12 bg-sk-accent mb-4 group-hover:w-full transition-all duration-500 shadow-[0_0_10px_var(--color-sk-accent)]"></div>
                
                {/* DESCRIPCIÓN */}
                <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium">
                  {team.description}
                </p>

                {/* BOTÓN DE ACCIÓN (Solo si recluta) */}
                <div className="h-12"> {/* Espacio reservado para evitar saltos de layout */}
                    {team.status === "RECLUTANDO" ? (
                        <Link href="/registro" className="w-full flex items-center justify-center gap-2 py-3 border border-white/20 bg-white/5 hover:bg-sk-accent hover:text-white hover:border-sk-accent font-bold uppercase tracking-wider transition-all duration-300 rounded group/btn">
                            Postular Ahora <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    ) : (
                        <div className="w-full py-3 text-center text-gray-600 font-bold uppercase text-xs tracking-widest border border-white/5 rounded cursor-not-allowed">
                            Próximamente
                        </div>
                    )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}