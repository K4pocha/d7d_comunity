"use client";
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { checkTwitchStatus } from "../app/actions";
// 1. IMPORTAMOS EL JSON PARA AUTOMATIZAR LA LISTA
import streamersData from "../data/streamers.json";

// 2. GENERAMOS LA LISTA DE IDs AUTOMÁTICAMENTE DESDE EL JSON
// Esto crea un array tipo ["benyiivt", "rubius", "ibai"]
const TEAM_ROSTER = streamersData.map(streamer => streamer.id);

export default function StreamBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [streams, setStreams] = useState<any[]>([]); 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [loading, setLoading] = useState(true);

  // CARGA DE DATOS (API TWITCH)
  useEffect(() => {
    async function fetchStream() {
      // Usamos la lista generada del JSON
      const data = await checkTwitchStatus(TEAM_ROSTER);
      setStreams(data || []);
      setLoading(false);
    }
    fetchStream();
    // Actualiza cada 2 minutos
    const interval = setInterval(fetchStream, 120000); 
    return () => clearInterval(interval);
  }, []);

  // CARRUSEL AUTOMÁTICO (Si hay más de 1 stream)
  useEffect(() => {
    if (streams.length > 1) {
      const rotationInterval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % streams.length);
      }, 5000); // Rota cada 5 segundos
      return () => clearInterval(rotationInterval);
    }
  }, [streams]);

  const nextStream = () => setCurrentIndex((prev) => (prev + 1) % streams.length);
  const prevStream = () => setCurrentIndex((prev) => (prev - 1 + streams.length) % streams.length);

  // Si no hay stream, está cargando o el usuario la cerró, no mostramos nada
  if (loading || streams.length === 0 || !isVisible) return null;

  const activeStream = streams[currentIndex];

  return (
    // CONTENEDOR PRINCIPAL
    // - relative z-[51]: Para estar encima del navbar pero dentro del header
    // - shadow-[...]: El efecto GLOW del color del tema hacia abajo
    <div className="w-full bg-[#0a0a0a] border-b border-white/10 relative z-[51] transition-all duration-500 shadow-[0_10px_30px_-10px_var(--color-sk-accent)]">
      
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        
        {/* --- IZQUIERDA: INDICADORES E INFO --- */}
        <div className="flex items-center gap-4 min-w-0">
          
          {/* Indicador LIVE (Con padding izquierdo 'pl-1' para que la animación no se corte) */}
          <div className="flex items-center gap-2 flex-shrink-0 pl-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span className="font-bold text-red-500 uppercase tracking-widest text-xs sm:text-sm">Live</span>
          </div>

          {/* Flechas de navegación (Solo si hay varios streams) */}
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

          {/* Info del Streamer (Nombre y Juego) */}
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

        {/* --- DERECHA: BOTONES DE ACCIÓN --- */}
        <div className="flex items-center gap-3 flex-shrink-0">
          
          {/* BOTÓN 1: PERFIL (Lleva a la tarjeta modal en /streamers) */}
          <Link 
            href={`/streamers?id=${activeStream.streamer.toLowerCase()}`}
          >
            <button className="hidden sm:flex items-center gap-2 border border-white/20 hover:border-white text-gray-300 hover:text-white px-3 py-1 rounded-sm text-xs font-bold uppercase transition-all duration-300">
                <User size={14} />
                Perfil
            </button>
          </Link>

          {/* BOTÓN 2: VER STREAM (Lleva a Twitch) */}
          <a 
            href={activeStream.url} 
            target="_blank" 
            className="bg-sk-accent hover:brightness-110 text-white px-4 py-1 rounded-sm text-xs font-bold uppercase transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.3)] whitespace-nowrap"
          >
            Ver Stream
          </a>
          
          {/* BOTÓN CERRAR */}
          <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-white transition-colors ml-2">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}