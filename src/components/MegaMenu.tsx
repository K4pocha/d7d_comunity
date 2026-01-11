"use client";
import Link from "next/link";
import { History, Users, Heart, Download, Briefcase, FileImage } from "lucide-react";

const MENU_ITEMS = [
  {
    title: "Nuestra Historia",
    href: "/nosotros?section=historia",
    description: "Desde los orígenes en 2010 hasta el renacer en 2026.",
    icon: History
  },
  {
    title: "Quiénes Somos",
    href: "/nosotros?section=somos",
    description: "Identidad élite fuera del sistema establecido.",
    icon: Users
  },
  {
    title: "Igualdad",
    href: "/nosotros?section=igualdad",
    description: "Compromiso con el talento sin género.",
    icon: Heart
  },
  {
    title: "Equipo (Staff)",
    href: "/nosotros?section=staff",
    description: "Conoce a quienes dirigen la operación.",
    icon: Briefcase
  },
  {
    title: "Kit de Marca",
    href: "/nosotros?section=brand",
    description: "Logotipos y guías de identidad visual.",
    icon: FileImage
  },
  {
    title: "Wallpapers",
    href: "/nosotros?section=brand",
    description: "Personaliza tu setup con el estilo D7D.",
    icon: Download
  }
];

export default function MegaMenu() {
  return (
    <div className="absolute top-full left-0 w-full bg-[#0a0a0a] border-t border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 z-40">
      
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
          
          {MENU_ITEMS.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className="group/item flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
            >
              {/* ICONO */}
              <div className="p-3 bg-white/5 rounded-lg text-sk-accent group-hover/item:bg-white/10 transition-all shadow-[0_0_15px_rgba(0,0,0,0.3)] group-hover/item:shadow-[0_0_20px_var(--color-sk-accent)]">
                <item.icon size={24} />
              </div>
              
              <div>
                {/* TÍTULO */}
                <h4 className="text-white font-black text-lg uppercase italic mb-1 group-hover/item:text-sk-accent transition-colors tracking-wide">
                  {item.title}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed group-hover/item:text-gray-300">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}

        </div>
      </div>
      
      {/* BARRA INFERIOR */}
      <div className="h-1 w-full bg-sk-accent shadow-[0_0_20px_var(--color-sk-accent)]"></div>
    </div>
  );
}