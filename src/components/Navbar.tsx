"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, User } from "lucide-react";
import MegaMenu from "./MegaMenu";
import ThemeToggle from "../components/ThemeToggle";
import dynamic from 'next/dynamic';

// Importación dinámica: No se carga hasta que el navegador esté listo
const StreamBar = dynamic(() => import('./StreamBar'), {
  ssr: false, // Opcional: Si quieres que solo cargue en el cliente (evita errores de hidratación)
  loading: () => <div className="h-10 w-full bg-[#0a0a0a]" />, // Un espacio vacío oscuro mientras carga
});

// Icono Discord SVG
const DiscordIcon = () => (
  <svg viewBox="0 0 127.14 96.36" fill="currentColor" className="w-5 h-5">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.09,105.09,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // AQUÍ ESTÁ EL CAMBIO: Usamos 'text-sk-accent' en lugar de 'text-cyan-400'
  const navLinkClass = (path: string) =>
    `text-sm font-bold uppercase tracking-wider transition-colors duration-300 hover:text-sk-accent ${
      pathname === path ? "text-sk-accent" : "text-gray-300"
    }`;

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-[#050505]/95 backdrop-blur-md shadow-lg border-b border-white/10" : "bg-transparent"
      }`}
    >
      <StreamBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <Image 
                src="/LogoDisplaced.png"
                alt="D7D Logo" 
                width={140} 
                height={50} 
                className="h-12 w-auto object-contain hover:brightness-110 transition-all"
                priority
              />
            </Link>
          </div>

          {/* MENÚ ESCRITORIO */}
          <div className="hidden md:block h-full">
            <div className="ml-10 flex items-center space-x-8 h-full">
              <Link href="/" className={navLinkClass("/")}>Inicio</Link>
              
              {/* MEGA MENÚ NOSOTROS */}
              <div className="group h-full flex items-center">
                <Link 
                  href="/nosotros" 
                  // AQUÍ TAMBIÉN: 'text-sk-accent'
                  className={`flex items-center gap-1 text-sm font-bold uppercase tracking-wider transition-colors duration-300 hover:text-sk-accent cursor-pointer ${pathname.startsWith("/nosotros") ? "text-sk-accent" : "text-gray-300"}`}
                >
                  Nosotros
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </Link>
                <MegaMenu />
              </div>

              <Link href="/equipos" className={navLinkClass("/equipos")}>Equipos</Link>
              <Link href="/streamers" className={navLinkClass("/streamers")}>Streamers</Link>
              <Link href="/partners" className={navLinkClass("/partners")}>Partners</Link>
              <Link href="/noticias" className={navLinkClass("/noticias")}>Noticias</Link>
            </div>
          </div>

          {/* DERECHA */}
          <div className="hidden md:flex items-center gap-6">
             <a href="https://discord.gg/tuserver" target="_blank" className="text-gray-400 hover:text-[#5865F2] transition-colors">
               <DiscordIcon />
             </a>
             <div className="h-6 w-px bg-white/10"></div>
             <ThemeToggle />
             <Link
              href="/login"
              // AQUÍ TAMBIÉN: bordes y textos con sk-accent
              className="border border-white/20 hover:border-sk-accent text-white hover:text-sk-accent px-4 py-1.5 rounded text-xs font-bold uppercase transition-all duration-300 flex items-center gap-2"
            >
              <User size={14} />
              <span>Login</span>
            </Link>
          </div>

          {/* MOVIL */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MOVIL */}
      {isOpen && (
        <div className="md:hidden bg-[#050505] border-t border-white/10 absolute w-full h-screen overflow-y-auto animate-fade-in z-40">
          <div className="px-4 pt-4 pb-20 space-y-1 flex flex-col">
            {/* AQUÍ TAMBIÉN: hover:text-sk-accent */}
            <Link href="/" onClick={() => setIsOpen(false)} className="px-3 py-4 text-xl font-bold uppercase border-b border-white/10 hover:text-sk-accent">Inicio</Link>
            <Link href="/nosotros" onClick={() => setIsOpen(false)} className="px-3 py-4 text-xl font-bold uppercase border-b border-white/10 hover:text-sk-accent">Nosotros</Link>
            <Link href="/equipos" onClick={() => setIsOpen(false)} className="px-3 py-4 text-xl font-bold uppercase border-b border-white/10 hover:text-sk-accent">Equipos</Link>
            <Link href="/streamers" onClick={() => setIsOpen(false)} className="px-3 py-4 text-xl font-bold uppercase border-b border-white/10 hover:text-sk-accent">Streamers</Link>
            <Link href="/partners" onClick={() => setIsOpen(false)} className="px-3 py-4 text-xl font-bold uppercase border-b border-white/10 hover:text-sk-accent">Partners</Link>
            <Link href="/noticias" onClick={() => setIsOpen(false)} className="px-3 py-4 text-xl font-bold uppercase border-b border-white/10 hover:text-sk-accent">Noticias</Link>
            <Link href="/login" onClick={() => setIsOpen(false)} className="px-3 py-4 text-xl font-bold uppercase border-b border-white/10 text-sk-accent">Iniciar Sesión</Link>
          </div>
        </div>
      )}
    </header>
  );
}