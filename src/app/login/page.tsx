"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { User, Lock, ArrowRight, Gamepad2 } from "lucide-react";

// Componente auxiliar local para mantener el archivo limpio
// SVG inline optimizado para React.
const DiscordLogo = () => (
  <svg className="w-5 h-5" viewBox="0 0 127.14 96.36" fill="currentColor">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.09,105.09,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
  </svg>
);

export default function LoginPage() {
  // UX: Estado de carga para dar feedback inmediato al usuario al enviar el formulario.
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir el refresh nativo del navegador
    setIsLoading(true);
    
    // TODO: Integrar aquí la llamada a la API de autenticación (Backend)
    // Simulamos latencia de red con setTimeout para pruebas de UI.
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-black overflow-hidden">
      
      {/* Background Layer: Separación de capas (z-index) para efecto de profundidad */}
      <div className="absolute inset-0 z-0">
        <Image 
            src="/fondo.jpg" 
            alt="Background" 
            fill 
            className="object-cover opacity-30" 
            priority // Performance: LCP (Largest Contentful Paint) optimizado
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md p-1">
        
        {/* Dynamic Glow: Usa var(--color-sk-accent) para reaccionar al tema elegido globalmente */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sk-accent to-transparent opacity-50 blur-md rounded-2xl animate-pulse-slow"></div>
        
        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4 hover:brightness-125 transition-all">
                <Image src="/LogoDisplaced.png" alt="Logo" width={180} height={60} className="h-10 w-auto object-contain mx-auto" />
            </Link>
            <h2 className="text-2xl font-black uppercase italic text-white tracking-wider">
              Iniciar <span className="text-sk-accent">Sesión</span>
            </h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">Identifícate.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Input Group: Usamos focus-within para iluminar el icono cuando el input tiene foco */}
            <div className="group">
              <div className="relative flex items-center">
                <User size={18} className="absolute left-4 text-gray-500 group-focus-within:text-sk-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Usuario / Email" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-sk-accent focus:bg-white/10 transition-all font-medium text-sm"
                  required
                />
              </div>
            </div>

            <div className="group">
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-4 text-gray-500 group-focus-within:text-sk-accent transition-colors" />
                <input 
                  type="password" 
                  placeholder="Contraseña" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-sk-accent focus:bg-white/10 transition-all font-medium text-sm"
                  required
                />
              </div>
            </div>

            {/* Utility Links */}
            <div className="flex justify-between items-center text-xs">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" className="rounded bg-white/10 border-white/20 text-sk-accent focus:ring-0" />
                Recordarme
              </label>
              <a href="#" className="text-sk-accent hover:underline">¿Olvidaste tu clave?</a>
            </div>

            {/* Submit Button: Manejo visual de estado 'loading' y 'disabled' */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-sk-accent text-white font-black uppercase py-3 rounded-lg hover:brightness-110 hover:shadow-[0_0_20px_var(--color-sk-accent)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="animate-pulse">Autenticando...</span>
              ) : (
                <>
                  Ingresar al Sistema <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0a] px-2 text-gray-500 font-bold tracking-widest">O conecta con</span>
            </div>
          </div>

          {/* Social Auth Grid */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-2.5 bg-[#5865F2]/10 border border-[#5865F2]/30 rounded-lg text-white hover:bg-[#5865F2] hover:border-[#5865F2] transition-all duration-300 group">
              <DiscordLogo />
              <span className="text-xs font-bold uppercase tracking-wide">Discord</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white hover:text-black transition-all duration-300">
               <Gamepad2 size={18} />
               <span className="text-xs font-bold uppercase tracking-wide">Steam</span>
            </button>
          </div>

          {/* Registration Link */}
          <p className="mt-8 text-center text-gray-500 text-sm">
            ¿Aún no tienes cuenta?{" "}
            <Link href="/registro" className="text-sk-accent font-bold hover:underline decoration-2 underline-offset-4">
              Crea tu cuenta aquí!            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}