"use client";
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { checkTwitchStatus } from "../app/actions";

// LISTA DE STREAMERS A MONITOREAR
const TEAM_ROSTER = [
  "xopxsam", 
  "shroud",       
  "ibai",  
  "d7d_official"
];

export default function StreamBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [streams, setStreams] = useState<any[]>([]); 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [loading, setLoading] = useState(true);

  // 1. CARGA DE DATOS (Al inicio y cada 2 mins)
  useEffect(() => {
    async function fetchStream() {
      const data = await checkTwitchStatus(TEAM_ROSTER);
      setStreams(data || []);
      setLoading(false);
    }
    fetchStream();
    const interval = setInterval(fetchStream, 120000); 
    return () => clearInterval(interval);
  }, []);

  // 2. ROTACIÓN AUTOMÁTICA (CARRUSEL)
  useEffect(() => {
    if (streams.length > 1) {
      const rotationInterval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % streams.length);
      }, 5000); // Cambia cada 5 segundos
      return () => clearInterval(rotationInterval);
    }
  }, [streams]);

  // FUNCIONES MANUALES
  const nextStream = () => setCurrentIndex((prev) => (prev + 1) % streams.length);
  const prevStream = () => setCurrentIndex((prev) => (prev - 1 + streams.length) % streams.length);

  // SI NO HAY STREAM O SE CERRÓ, NO RENDERIZAR NADA
  if (loading || streams.length === 0 || !isVisible) return null;

  const activeStream = streams[currentIndex];

  return (
    <div className="fixed top-20 w-full z-40 bg-sk-dark border-b border-white/10 animate-fade-in shadow-lg shadow-sk-accent/10 transition-all duration-500">
      
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        
        {/* --- IZQUIERDA: INDICADORES E INFO --- */}
        <div className="flex items-center gap-4">
          
          {/* Indicador LIVE (Rojo fijo) */}
          <div className="flex items-center gap-2 min-w-[60px]">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span className="font-bold text-red-500 uppercase tracking-widest text-sm">Live</span>
          </div>

          {/* Flechas (Solo si hay más de 1 en vivo) */}
          {streams.length > 1 && (
            <div className="flex gap-1 border-r border-white/10 pr-3 mr-1">
              <button onClick={prevStream} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                <ChevronLeft size={16}/>
              </button>
              <button onClick={nextStream} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                <ChevronRight size={16}/>
              </button>
            </div>
          )}

          {/* Info del Streamer */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-3 transition-opacity duration-300">
            <span className="font-bold text-xl uppercase italic text-white">
              {activeStream.streamer}
            </span>
            <span className="text-gray-400 text-sm font-body hidden md:block border-l border-white/20 pl-3 ml-1">
              jugando 
              {/* AQUÍ ESTÁ EL CAMBIO: text-sk-accent se adapta al tema */}
              <span className="text-sk-accent font-bold ml-1 uppercase">{activeStream.game}</span> 
              <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300 font-mono">
                👥 {activeStream.viewers}
              </span>
            </span>
          </div>
        </div>

        {/* --- DERECHA: BOTONES --- */}
        <div className="flex items-center gap-4">
          {/* Contador (Ej: 1/2) */}
          {streams.length > 1 && (
            <span className="text-xs text-gray-500 font-mono hidden sm:block">
              {currentIndex + 1} / {streams.length}
            </span>
          )}

          <a 
            href={activeStream.url} 
            target="_blank" 
            // AQUÍ ESTÁ EL CAMBIO: bg-sk-accent cambia el fondo del botón según el tema
            className="bg-sk-accent hover:brightness-110 text-white px-6 py-1 rounded text-sm font-bold uppercase skew-x-[-10deg] transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
          >
            <span className="block skew-x-[10deg]">Ver Stream</span>
          </a>
          
          <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}