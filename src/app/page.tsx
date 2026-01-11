import PartnerRow from "@/src/components/PartnerRow";
import Image from "next/image";
import Link from "next/link";
import socialLinks from "@/src/data/social-links.json"; 
import newsData from "@/src/data/news.json"; 
import { Users, Gamepad2 } from "lucide-react"; 

// Iconos SVG simples para no depender de librerías externas si no quieres
const DiscordIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 127.14 96.36" fill="currentColor"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.09,105.09,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" /></svg>
);

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* HERO SECTION CON FONDO PERSONALIZADO */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        
        {/* 1. IMAGEN DE FONDO (fondo.jpg) */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/fondo.jpg" 
            alt="Background" 
            fill 
            className="object-cover opacity-40" // Opacidad para que se lea el texto
            priority
          />
          {/* Gradiente para suavizar la unión con el footer/sección siguiente */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a]" />
        </div>

        <div className="relative z-10 text-center px-4 animate-fade-in max-w-5xl mx-auto">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 font-bold tracking-[0.5em] text-sm uppercase mb-6 block drop-shadow-sm">
            Est 2010 • Reborn 2026
          </span>
          
          <div className="mb-12 relative flex justify-center">
            <Image
              src="/LogoDisplaced.png"
              alt="D7D Logo"
              width={800}
              height={300}
              className="w-full max-w-[400px] md:max-w-[700px] h-auto object-contain drop-shadow-[0_0_35px_rgba(0,255,255,0.3)]"
              priority
            />
          </div>

          {/* BOTONES CON EFECTO "SKEW" (Caja cursiva, Texto recto) */}
          <div className="flex flex-col md:flex-row gap-6 justify-center mt-12">
            
            <Link href="/equipos">
                {/* Nota: -skew-x-12 inclina la caja, skew-x-12 endereza el contenido */}
                <button className="group relative bg-white text-black px-10 py-4 font-black text-xl uppercase hover:bg-cyan-400 transition-all transform -skew-x-12 hover:scale-105 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                  <div className="flex items-center gap-3 transform skew-x-12">
                    <Users size={24} className="text-black" />
                    <span>Nuestra Comunidad</span>
                  </div>
                </button>
            </Link>

            <a 
                href={socialLinks.discord} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative bg-transparent border-2 border-white/30 text-white px-10 py-4 font-black text-xl uppercase transition-all transform -skew-x-12 hover:border-[#5865F2] hover:bg-[#5865F2] hover:shadow-[0_0_20px_rgba(88,101,242,0.6)]"
            >
              <div className="flex items-center gap-3 transform skew-x-12">
                <DiscordIcon />
                <span>Unirse al Discord</span>
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* PARTNERS (Barra Infinita) */}
      <PartnerRow />

      {/* SECCIÓN NOTICIAS */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Últimas</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Noticias</span>
          </h2>
          <Link href="/noticias" className="text-cyan-400 font-bold hover:text-pink-500 transition-colors uppercase tracking-widest text-sm">Ver todo →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsData.map((news) => (
            <article key={news.id} className="bg-[#111] border border-white/5 hover:border-pink-500/50 transition-all group cursor-pointer flex flex-col h-full hover:-translate-y-2 duration-300">
              <div className="h-64 bg-gray-900 relative overflow-hidden">
                <Image 
                  src={news.image} 
                  alt={news.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                />
                <div className="absolute top-0 left-0 bg-pink-600 text-white text-xs font-black px-3 py-1 uppercase skew-x-[-12deg] -ml-2 shadow-lg">
                   <span className="block skew-x-[12deg]">{news.category}</span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow relative">
                <div className="mb-3 text-xs text-cyan-400 font-mono uppercase tracking-wider">{news.date}</div>
                <h3 className="text-xl font-bold mb-4 leading-tight text-white group-hover:text-pink-400 transition-colors">
                  {news.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                  {news.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}