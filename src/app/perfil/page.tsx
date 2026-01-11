"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  User, Settings, Shield, Cpu, Monitor, Mouse, 
  Gamepad2, LogOut, CheckCircle2, AlertCircle 
} from "lucide-react";

// MOCK DATA (Simulamos datos que vendrían de la base de datos)
const USER_DATA = {
  nickname: "K4POCHA",
  role: "Lead Developer",
  rank: "Global Elite",
  avatar: "/fondo.jpg", // Usamos el fondo como placeholder por ahora
  joined: "Ene 2026",
  specs: {
    cpu: "AMD Ryzen 9 5900X",
    gpu: "NVIDIA RTX 4080",
    ram: "32GB DDR4 3600MHz",
    mouse: "Logitech G Pro X",
    monitor: "Zowie XL2546K 240Hz"
  }
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER DEL PERFIL */}
        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 mb-8 overflow-hidden group">
          {/* Fondo decorativo con gradiente dinámico */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sk-accent/10 blur-[100px] rounded-full group-hover:bg-sk-accent/20 transition-all duration-500"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* AVATAR */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#111] ring-2 ring-sk-accent shadow-[0_0_20px_var(--color-sk-accent)]">
                <Image src={USER_DATA.avatar} alt="Avatar" fill className="object-cover" />
              </div>
              <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-black" title="Online"></div>
            </div>

            {/* INFO PRINCIPAL */}
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-4xl font-black italic uppercase text-white tracking-wide">{USER_DATA.nickname}</h1>
                <span className="px-3 py-1 bg-sk-accent/10 border border-sk-accent/30 text-sk-accent text-xs font-bold uppercase rounded tracking-widest">
                  {USER_DATA.role}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">Miembro desde {USER_DATA.joined} • ID: #8821</p>
              
              {/* BARRA DE EXP/NIVEL (Decorativa) */}
              <div className="w-full max-w-md bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-sk-accent h-full w-[75%] shadow-[0_0_10px_var(--color-sk-accent)]"></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right max-w-md">Lvl. 42 (75%)</p>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex gap-3">
               <button className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors">
                 <Settings size={20} />
               </button>
               <button className="px-6 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all flex items-center gap-2 font-bold text-sm uppercase">
                 <LogOut size={18} /> Logout
               </button>
            </div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL (GRID) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA: ESTADO DE CUENTAS */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Tarjeta de Vinculaciones */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold uppercase italic text-white mb-6 flex items-center gap-2">
                <Shield size={20} className="text-sk-accent" /> Conexiones
              </h3>
              
              <div className="space-y-4">
                {/* DISCORD - Conectado */}
                <div className="flex items-center justify-between p-4 bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-lg">
                   <div className="flex items-center gap-3">
                     <Gamepad2 className="text-[#5865F2]" />
                     <div>
                       <p className="text-white font-bold text-sm">Discord</p>
                       <p className="text-[#5865F2] text-xs">@k4pocha</p>
                     </div>
                   </div>
                   <CheckCircle2 size={18} className="text-green-400" />
                </div>

                {/* STEAM - Pendiente */}
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer group">
                   <div className="flex items-center gap-3">
                     <Gamepad2 className="text-white" />
                     <div>
                       <p className="text-gray-400 group-hover:text-white font-bold text-sm transition-colors">Steam</p>
                       <p className="text-gray-600 text-xs">Sin vincular</p>
                     </div>
                   </div>
                   <AlertCircle size={18} className="text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Stats Rápidas (Placeholder) */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
               <h3 className="text-white font-bold uppercase text-sm mb-4">Actividad Reciente</h3>
               <div className="space-y-4 text-sm text-gray-400">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Torneos Jugados</span>
                    <span className="text-white font-mono">12</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Horas en Servidor</span>
                    <span className="text-white font-mono">340h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>K/D Ratio Promedio</span>
                    <span className="text-sk-accent font-mono">1.42</span>
                  </div>
               </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: SETUP & DETALLES */}
          <div className="lg:col-span-2">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-8 h-full">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black uppercase italic text-white">Gaming Setup</h3>
                <button className="text-xs uppercase font-bold text-sk-accent hover:underline">Editar Specs</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* CPU */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-sk-accent/50 transition-colors group">
                   <div className="flex items-center gap-3 mb-2 text-gray-400 group-hover:text-sk-accent">
                      <Cpu size={20} />
                      <span className="text-xs font-bold uppercase tracking-wider">Procesador</span>
                   </div>
                   <p className="text-white font-medium">{USER_DATA.specs.cpu}</p>
                </div>

                {/* GPU */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-sk-accent/50 transition-colors group">
                   <div className="flex items-center gap-3 mb-2 text-gray-400 group-hover:text-sk-accent">
                      <Monitor size={20} />
                      <span className="text-xs font-bold uppercase tracking-wider">Tarjeta Gráfica</span>
                   </div>
                   <p className="text-white font-medium">{USER_DATA.specs.gpu}</p>
                </div>

                {/* RAM */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-sk-accent/50 transition-colors group">
                   <div className="flex items-center gap-3 mb-2 text-gray-400 group-hover:text-sk-accent">
                      <Cpu size={20} />
                      <span className="text-xs font-bold uppercase tracking-wider">Memoria RAM</span>
                   </div>
                   <p className="text-white font-medium">{USER_DATA.specs.ram}</p>
                </div>

                {/* PERIFÉRICOS */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-sk-accent/50 transition-colors group">
                   <div className="flex items-center gap-3 mb-2 text-gray-400 group-hover:text-sk-accent">
                      <Mouse size={20} />
                      <span className="text-xs font-bold uppercase tracking-wider">Periféricos</span>
                   </div>
                   <p className="text-white font-medium">{USER_DATA.specs.mouse}</p>
                   <p className="text-gray-500 text-xs mt-1">{USER_DATA.specs.monitor}</p>
                </div>

              </div>

              {/* AREA DE BIO / TEXTO */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <h4 className="text-white font-bold uppercase text-sm mb-3">Bio / Acerca de mí</h4>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Jugador competitivo desde 2015. Especializado en roles de Entry Fragger. 
                  Actualmente desarrollando la próxima generación de plataformas para esports.
                  "No formar parte de lo común."
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}