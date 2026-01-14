"use client";
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { checkTwitchStatus } from "../app/actions"; 
// YA NO IMPORTAMOS EL JSON
// import streamersData from "../data/streamers.json";

export default function StreamBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [streams, setStreams] = useState<any[]>([]); 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [loading, setLoading] = useState(true);

  // --- FUNCIÓN AUXILIAR ---
  // Convierte "https://www.twitch.tv/benyiivt" -> "benyiivt"
  const getTwitchUsername = (url: string) => {
    if (!url) return null;
    try {
        const cleanUrl = url.trim().toLowerCase();
        // Si el admin puso solo el nombre, lo devolvemos
        if (!cleanUrl.includes("twitch.tv")) return cleanUrl;
        
        // Si es URL, cortamos lo que está después de twitch.tv/
        const parts = cleanUrl.split("twitch.tv/");
        if (parts.length > 1) {
            // Quitamos posibles barras finales o parámetros extra
            return parts[1].split("/")[0].split("?")[0];
        }
        return null;
    } catch (e) { return null; }
  };

  // --- CARGA DE DATOS ---
  useEffect(() => {
    async function fetchStreamersAndCheckStatus() {
      try {
        // 1. Buscamos el equipo de Streamers en la API
        const resTeams = await fetch('/api/teams');
        const teams = await resTeams.json();
        // Asegúrate de que el slug en el admin sea 'streamers' o 'creadores'
        const creatorTeam = teams.find((t: any) => t.slug === 'streamers' || t.slug === 'creadores');

        if (!creatorTeam) {
            console.warn("No se encontró el equipo 'streamers' en la BD");
            setLoading(false);
            return;
        }

        // 2. Obtenemos el roster de ese equipo
        const resRoster = await fetch(`/api/roster?game_id=${creatorTeam.id}`);
        const roster = await resRoster.json();

        // 3. Extraemos los usuarios de Twitch de la columna 'socials'
        const twitchUsernames: string[] = [];

        roster.forEach((member: any) => {
            try {
                // Parseamos el JSON de socials si viene como string
                const socials = typeof member.socials === 'string' ? JSON.parse(member.socials) : member.socials;
                
                if (socials && socials.twitch) {
                    const username = getTwitchUsername(socials.twitch);
                    if (username) twitchUsernames.push(username);
                }
            } catch (e) {
                // Si falla uno, continuamos con el siguiente
            }
        });

        // 4. Consultamos a Twitch quién está Live
        if (twitchUsernames.length > 0) {
            const liveData = await checkTwitchStatus(twitchUsernames);
            setStreams(liveData || []);
        }

      } catch (error) {
        console.error("Error en StreamBar:", error);
      } finally {
        setLoading(false);
      }
    }

    // Ejecutar al inicio
    fetchStreamersAndCheckStatus();

    // Actualizar cada 2 minutos
    const interval = setInterval(fetchStreamersAndCheckStatus, 120000); 
    return () => clearInterval(interval);
  }, []);

  // --- CARRUSEL (Igual que antes) ---
  useEffect(() => {
    if (streams.length > 1) {
      const rotationInterval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % streams.length);
      }, 5000);
      return () => clearInterval(rotationInterval);
    }
  }, [streams]);

  const nextStream = () => setCurrentIndex((prev) => (prev + 1) % streams.length);
  const prevStream = () => setCurrentIndex((prev) => (prev - 1 + streams.length) % streams.length);

  if (loading || streams.length === 0 || !isVisible) return null;

  const activeStream = streams[currentIndex];

  return (
    <div className="w-full bg-[#0a0a0a] border-b border-white/10 relative z-[51] transition-all duration-500 shadow-[0_10px_30px_-10px_var(--color-sk-accent)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        
        {/* IZQUIERDA: INFO */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2 flex-shrink-0 pl-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span className="font-bold text-red-500 uppercase tracking-widest text-xs sm:text-sm">Live</span>
          </div>

          {streams.length > 1 && (
            <div className="hidden sm:flex gap-1 border-r border-white/10 pr-3 mr-1 flex-shrink-0">
              <button onClick={prevStream} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                <ChevronLeft size={16}/>
              </button>
              <button onClick={nextStream} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                <ChevronRight size={16}/>
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="font-black text-lg text-white uppercase italic tracking-tighter flex-shrink-0">
              {activeStream.streamer}
            </span>
            <div className="hidden md:flex items-center text-sm text-gray-400 border-l border-white/20 pl-3 ml-1 overflow-hidden">
              <span className="flex-shrink-0">jugando</span>
              <span className="text-sk-accent font-bold ml-1 uppercase truncate">
                {activeStream.game}
              </span> 
              <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300 font-mono flex-shrink-0">
                👥 {activeStream.viewers}
              </span>
            </div>
          </div>
        </div>

        {/* DERECHA: BOTONES */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Enlace al perfil de streamers */}
          <Link href={`/streamers`}>
            <button className="hidden sm:flex items-center gap-2 border border-white/20 hover:border-white text-gray-300 hover:text-white px-3 py-1 rounded-sm text-xs font-bold uppercase transition-all duration-300">
                <User size={14} />
                Perfil
            </button>
          </Link>

          <a 
            href={activeStream.url} 
            target="_blank" 
            className="bg-sk-accent hover:brightness-110 text-white px-4 py-1 rounded-sm text-xs font-bold uppercase transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.3)] whitespace-nowrap"
          >
            Ver Stream
          </a>
          
          <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-white transition-colors ml-2">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}