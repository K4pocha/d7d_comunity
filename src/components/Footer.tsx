"use client";

import { Twitter, Instagram, Youtube, Twitch, Mail } from "lucide-react";
import socialLinks from "../data/social-links.json"; 
import { useEffect } from "react";
import { FaTiktok } from "react-icons/fa";

// Componente Discord Icon (SVG personalizado)
const DiscordIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 127.14 96.36" fill="currentColor">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.09,105.09,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
  </svg>
);

export default function Footer() {
  const socialNetworks = [
    { icon: DiscordIcon, href: socialLinks.discord, label: "Discord" },
    { icon: Instagram, href: "https://www.instagram.com/d7d.cl/", label: "Instagram" },
    { icon: FaTiktok, href: socialLinks.tiktok, label: "TikTok" },
  ];

  // Filtramos solo las que tengan link definido (o en el caso de Instagram, que ya lo pusimos manual)
  const activeNetworks = socialNetworks.filter(social => social.href && social.href !== "");

  // EFECTO HACKER: Mensaje en la consola
  useEffect(() => {
    console.log(
      "%c Developed by K4pocha",
      "background: #000; color: #ec4899; font-size: 20px; font-weight: bold; padding: 10px; border: 2px solid #ec4899; border-radius: 5px;"
    );
    console.log(
      "%c ¿Te gusta el código? Contáctame en github.com/k4pocha",
      "color: #aaa; font-size: 12px;"
    );
  }, []);

  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-20 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-10">

        {/* TEXTO */}
        <div className="text-center md:text-left">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800 opacity-90 py-4 px-1 leading-normal">
            SIGUENOS
          </h2>
          
          <div className="flex flex-col gap-2 px-3 mt-[-10px]">
            <p className="text-gray-500 uppercase tracking-widest text-sm font-bold">
              SER PARTE DE DISP7ACED
            </p>
            <a 
              href="mailto:contacto@d7d.cl" 
              className="text-gray-400 hover:text-[#ec4899] transition-colors duration-300 text-sm flex items-center justify-center md:justify-start gap-2"
            >
              <Mail size={16} />
              contacto@d7d.cl
            </a>
          </div>
        </div>

        {/* ICONOS */}
        <div className="flex gap-4 flex-wrap justify-center">
          {activeNetworks.map((social, i) => (
            <a
              key={i}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#ec4899] hover:text-white transition-all duration-300 text-gray-400 hover:scale-110 hover:shadow-[0_0_15px_#ec4899]"
            >
              <social.icon size={20} />
            </a>
          ))}
        </div>
      </div>

      <div className="text-center mt-20 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center px-4 gap-4">

        {/* Copyright */}
        <div className="text-gray-600 text-xs uppercase tracking-wider">
          © 2026 Disp7aceD Network. All rights reserved.
        </div>

        {/* TU FIRMA */}
        <a
          href="https://k4pocha.vercel.app" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase font-bold tracking-widest text-gray-700 hover:text-[#ec4899] transition-colors duration-300 flex items-center gap-2 group"
        >
          <span>Developed by</span>
          <span className="group-hover:underline decoration-[#ec4899] underline-offset-4">
            K4pocha 
          </span>
        </a>

      </div>
    </footer>
  );
}