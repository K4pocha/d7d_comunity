"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, User, LogOut, Settings, LayoutDashboard, Edit3, Swords } from "lucide-react";
import StreamBar from "./StreamBar";
import MegaMenu from "./MegaMenu";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";


const DiscordIcon = () => (
  <svg viewBox="0 0 127.14 96.36" fill="currentColor" className="w-5 h-5"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.09,105.09,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" /></svg>
);

export default function Navbar() {
  const { user, logout } = useAuth(); // <--- OBTENER USUARIO
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Estado para el menú desplegable del perfil
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    // Cerrar menú perfil al hacer click fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinkClass = (path: string) =>
    `text-sm font-bold uppercase tracking-wider transition-colors duration-300 hover:text-sk-accent ${pathname === path ? "text-sk-accent" : "text-gray-300"
    }`;

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? "bg-[#050505]/95 backdrop-blur-md shadow-lg border-white/10" : "bg-transparent border-transparent"}`}>
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${scrolled ? "h-0 opacity-0" : "h-10 opacity-100"}`}>
        <StreamBar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-14" : "h-20"}`}>

          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <Image src="/LogoDisplacedCompleto.png" alt="Disp7aceD Logo" width={150} height={50} className={`w-50 object-contain hover:brightness-110 transition-all duration-300 ${scrolled ? "h-7" : "h-9"}`} priority />
            </Link>
          </div>

          <div className="hidden md:block h-full">
            <div className="ml-10 flex items-center space-x-8 h-full">
              <Link href="/" className={navLinkClass("/")}>Inicio</Link>
              <div className="group h-full flex items-center">
                <Link href="/nosotros" className={`flex items-center gap-1 text-sm font-bold uppercase tracking-wider transition-colors duration-300 hover:text-sk-accent group-hover:text-sk-accent cursor-pointer ${pathname.startsWith("/nosotros") ? "text-sk-accent" : "text-gray-300"}`}>
                  Nosotros <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </Link>
                <MegaMenu />
              </div>
              <Link href="/equipos" className={navLinkClass("/equipos")}>Equipos</Link>
              <Link href="/noticias" className={navLinkClass("/noticias")}>Noticias</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="https://discord.gg/5b6epPJB82" target="_blank" className="text-gray-400 hover:text-[#5865F2] transition-colors"><DiscordIcon /></a>
            <div className="h-6 w-px bg-white/10"></div>
            <ThemeToggle />

            {/* --- LÓGICA DE USUARIO --- */}
            {user ? (
              // SI HAY USUARIO: Mostrar Avatar y Dropdown
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-white/10"
                >
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-sk-accent to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_var(--color-sk-accent)]">
                    {user.avatar && user.avatar !== "/fondo.jpg" ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded" />
                    ) : (
                      user.nickname.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-white uppercase leading-none">{user.nickname}</p>
                    <p className="text-[10px] text-sk-accent font-bold tracking-widest uppercase mt-0.5">{user.role}</p>
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-xl overflow-hidden animate-fade-in z-50">
                    <div className="p-3 border-b border-white/5">
                      <p className="text-white font-bold text-sm truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/perfil" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <User size={16} /> Mi Perfil
                      </Link>
                      {user.role === 'ADMIN' && (
                        <>
                          <div className="px-4 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            Administración
                          </div>
                          
                          <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                            <LayoutDashboard size={16} /> Panel General
                          </Link>

                          {/* Enlace directo a Crear Noticia */}
                          <Link href="/admin/crear-noticia" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                            <Edit3 size={16} /> Publicar Noticia
                          </Link>

                          {/* --- NUEVO: ENLACE A GESTIONAR EQUIPOS --- */}
                          <Link href="/admin/equipos" className="flex items-center gap-2 px-4 py-2 text-sm text-sk-accent hover:bg-sk-accent/10 transition-colors">
                            <Swords size={16} /> Editar Equipos
                          </Link>

                          <div className="my-1 border-t border-white/5"></div>
                        </>
                      )}
                      <Link href="/ajustes" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <Settings size={16} /> Ajustes
                      </Link>
                    </div>
                    <div className="border-t border-white/5 py-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
                      >
                        <LogOut size={16} /> Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // SI NO HAY USUARIO: Mostrar Botón Login
              <Link
                href="/login"
                className="border border-white/20 hover:border-sk-accent text-white hover:text-sk-accent px-4 py-1.5 rounded text-xs font-bold uppercase transition-all duration-300 flex items-center gap-2"
              >
                <User size={14} />
                <span>Login</span>
              </Link>
            )}
          </div>

          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil */}
    </header>
  );
}