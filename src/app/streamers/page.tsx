"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { X, Twitch, Twitter, Instagram, Youtube } from "lucide-react";
// 1. IMPORTAMOS EL JSON
import streamersData from "@/src/data/streamers.json";

function StreamersContent() {
  const searchParams = useSearchParams();
  const [selectedStreamer, setSelectedStreamer] = useState<any>(null);

  useEffect(() => {
    const streamerId = searchParams.get("id");
    if (streamerId) {
      // 2. USAMOS EL JSON PARA BUSCAR
      const found = streamersData.find((s) => s.id.toLowerCase() === streamerId.toLowerCase());
      if (found) setSelectedStreamer(found);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 mb-4">
          Nuestros Creadores
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Conoce a las voces y caras que dan vida a D7D Network.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* 3. USAMOS EL JSON PARA GENERAR LAS TARJETAS */}
        {streamersData.map((streamer) => (
          <div 
            key={streamer.id}
            onClick={() => setSelectedStreamer(streamer)}
            className="group relative bg-sk-dark border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-sk-accent transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--color-sk-accent-rgb),0.2)] hover:-translate-y-2"
          >
            <div className="h-80 bg-gray-800 relative">
               {/* <Image src={streamer.image} alt={streamer.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" /> */}
               <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-mono text-xs">
                 {streamer.image}
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            </div>
            <div className="absolute bottom-0 w-full p-4">
              <h3 className="text-2xl font-black uppercase italic text-white group-hover:text-sk-accent transition-colors">
                {streamer.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedStreamer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row">
            <button 
              onClick={() => setSelectedStreamer(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-white text-white hover:text-black p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-full md:w-2/5 h-64 md:h-auto bg-gray-800 relative">
               {/* <Image src={selectedStreamer.image} alt={selectedStreamer.name} fill className="object-cover" /> */}
               <div className="absolute inset-0 flex items-center justify-center text-gray-500">Foto</div>
            </div>

            <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
              <h2 className="text-4xl font-black uppercase italic text-sk-accent mb-2">
                {selectedStreamer.name}
              </h2>
              
              {/* --- AQUÍ ESTÁ EL CAMBIO --- */}
              {/* Se agregó 'whitespace-pre-line' para que respete los \n */}
              <p className="text-gray-300 mb-6 leading-relaxed whitespace-pre-line text-justify">
                {selectedStreamer.bio}
              </p>

              <div className="flex gap-4 mb-8">
                {selectedStreamer.socials.twitch && (
                  <a href={selectedStreamer.socials.twitch} target="_blank" className="text-gray-400 hover:text-[#9146FF] transition-colors"><Twitch /></a>
                )}
                {selectedStreamer.socials.twitter && (
                  <a href={selectedStreamer.socials.twitter} target="_blank" className="text-gray-400 hover:text-[#1DA1F2] transition-colors"><Twitter /></a>
                )}
                {selectedStreamer.socials.instagram && (
                   <a href={selectedStreamer.socials.instagram} target="_blank" className="text-gray-400 hover:text-[#E1306C] transition-colors"><Instagram /></a>
                )}
                 {selectedStreamer.socials.youtube && (
                   <a href={selectedStreamer.socials.youtube} target="_blank" className="text-gray-400 hover:text-[#FF0000] transition-colors"><Youtube /></a>
                )}
              </div>

              <a 
                href={selectedStreamer.socials.twitch} 
                target="_blank"
                className="bg-white text-black font-bold uppercase py-3 text-center rounded hover:bg-sk-accent hover:text-white transition-colors"
              >
                Ir al canal
              </a>
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedStreamer(null)} />
        </div>
      )}
    </div>
  );
}

export default function StreamersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>}>
      <StreamersContent />
    </Suspense>
  );
}