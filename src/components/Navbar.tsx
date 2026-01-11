"use client";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import ThemeToggle from "../components/ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Equipos", href: "/equipos" },
    { name: "Acerca de", href: "/acerca" },
    { name: "Eventos", href: "/eventos" },
    { name: "Partners", href: "/partners" },
  ];

  return (
    <nav className="fixed w-full z-50 bg-sk-black/90 backdrop-blur-md border-b border-white/10 neon-border-bottom">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">

          {/* LOGO */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/LogoDisplaced.png" // Next.js busca automáticamente en la carpeta public
              alt="D7D Logo"
              width={120} // Ajusta el ancho que prefieras
              height={40} // Ajusta el alto
              className="object-contain" // Esto evita que el logo se estire o deforme
              priority // Esto hace que cargue instantáneo
            />
          </Link>

          {/* MENÚ DE ESCRITORIO */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md text-sm font-medium transition-all uppercase tracking-wide"
              >
                {link.name}
              </Link>
            ))}
            <div className="ml-4 border-l border-white/20 pl-4">
              <ThemeToggle /> 
            </div>

          </div>

          {/* BOTÓN MOVIL */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MOVIL */}
      {isOpen && (
        <div className="md:hidden bg-sk-dark border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-4 text-base font-bold text-white hover:bg-white/10 border-b border-white/5"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}