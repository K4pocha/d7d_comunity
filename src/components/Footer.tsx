import { Twitter, Instagram, Youtube, Twitch, Facebook } from "lucide-react";
// 1. IMPORTAMOS LOS DATOS
import socialLinks from "../data/social-links.json";

// Componente del icono de Discord
const DiscordIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 127.14 96.36" fill="currentColor">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.09,105.09,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
  </svg>
);

export default function Footer() {
  const socialNetworks = [
    { icon: DiscordIcon, href: socialLinks.discord, label: "Discord" },
    { icon: Twitter, href: socialLinks.twitter, label: "Twitter" },
    { icon: Instagram, href: socialLinks.instagram, label: "Instagram" },
    { icon: Twitch, href: socialLinks.twitch, label: "Twitch" },
    { icon: Youtube, href: socialLinks.youtube, label: "Youtube" },
  ];

  const activeNetworks = socialNetworks.filter(social => social.href && social.href !== "");

  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-20 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-10">

        {/* TEXTO - AQUÍ ESTÁ EL ARREGLO */}
        <div>
          {/* Cambié leading-tight por leading-normal y aseguré pb-6 */}
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800 opacity-90 pb-6 leading-normal">
            SIGUENOS
          </h2>
          <p className="text-gray-500 mt-0 uppercase tracking-widest text-sm">Se parte de #DIsp7aceDNetwork</p>
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
              // AQUÍ TAMBIÉN: Usamos var(--color-sk-accent) para el hover shadow
              className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-sk-accent hover:text-white transition-all duration-300 text-gray-400 hover:scale-110 hover:shadow-[0_0_15px_var(--color-sk-accent)]"
            >
              <social.icon size={20} />
            </a>
          ))}
        </div>
      </div>

      <div className="text-center mt-20 text-gray-600 text-xs uppercase">
        © 2026 DIsp7aceD Network. All rights reserved.
      </div>
    </footer>
  );
}