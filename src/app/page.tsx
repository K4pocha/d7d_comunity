"use client"; // Obligatorio para usar useState y useEffect

import { useState, useEffect } from "react";
import PartnerRow from "@/src/components/PartnerRow";
import Image from "next/image";
import Link from "next/link";
import socialLinks from "@/src/data/social-links.json"; 
import { Users, Calendar } from "lucide-react"; 

// Icono Discord
const DiscordIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 127.14 96.36" fill="currentColor">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.09,105.09,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
  </svg>
);

export default function Home() {
  // 1. ESTADO: Aquí guardamos las noticias que vienen de la API
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. EFECTO: Se ejecuta al cargar la página para pedir las noticias
  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        // Tomamos solo las primeras 3 noticias para la portada
        const formatted = Array.isArray(data) ? data.slice(0, 3).map((item: any) => ({
          id: item.id,
          title: item.title,
          excerpt: item.summary,
          date: new Date(item.created_at).toLocaleDateString(),
          image: item.image || "/news-placeholder.jpg",
          category: item.category || "General"
        })) : [];
        setLatestNews(formatted);
      })
      .catch((err) => console.error("Error cargando noticias:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col">

      {/* HERO SECTION */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-sk-dark">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sk-accent/20 via-transparent to-transparent opacity-50" />

        <div className="relative z-10 text-center px-4 animate-fade-in">
          <span className="text-sk-accent font-bold tracking-[0.5em] text-sm uppercase mb-4 block">
            Est 2026
          </span>
          <div className="mb-10 relative">
            <Image
              src="/LogoDisplaced.png"
              alt="D7D Logo"
              width={800}
              height={200}
              className="w-full max-w-[300px] md:max-w-[800px] h-auto object-contain drop-shadow-[0_0_20px_var(--color-sk-accent)]"
              priority
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
            <Link href="/equipos">
                <button className="bg-white text-black px-8 py-4 font-bold text-lg uppercase hover:bg-gray-200 transition-colors w-full md:w-auto flex items-center justify-center gap-3">
                  <Users size={24} className="text-sk-accent" />
                  Nuestra Comunidad
                </button>
            </Link>

            <a 
                href={socialLinks.discord} 
                target="_blank" 
                rel="noopener noreferrer"
                className="border border-white/30 text-white px-8 py-4 font-bold text-lg uppercase transition-all duration-300 flex items-center justify-center gap-3 hover:bg-[#5865F2] hover:border-[#5865F2] hover:shadow-[0_0_20px_rgba(88,101,242,0.5)] w-full md:w-auto"
            >
              <DiscordIcon />
              Unirse al Discord
            </a>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <PartnerRow />

      {/* SECCIÓN NOTICIAS DINÁMICAS */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-black uppercase italic">Últimas Noticias</h2>
          <Link href="/noticias" className="text-sk-accent font-bold hover:underline">Ver todo →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {loading ? (
             <div className="col-span-3 text-center py-10 text-gray-500 animate-pulse uppercase tracking-widest font-bold text-xs">
                Cargando noticias desde la base de datos...
             </div>
          ) : (
             latestNews.map((news) => (
                <Link key={news.id} href={`/noticias/${news.id}`}>
                    <article className="bg-[#111] border border-white/5 hover:border-sk-accent transition-all group cursor-pointer flex flex-col h-full hover:-translate-y-2 duration-300 rounded-xl overflow-hidden">
                    
                    {/* IMAGEN DE LA NOTICIA */}
                    <div className="h-64 bg-gray-900 relative overflow-hidden">
                        <img 
                          src={news.image} 
                          alt={news.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                        />
                        <div className="absolute top-0 left-0 bg-sk-accent text-white text-xs font-black px-3 py-1 uppercase skew-x-[-12deg] -ml-2 shadow-lg">
                            <span className="block skew-x-[12deg]">{news.category}</span>
                        </div>
                    </div>

                    <div className="p-8 flex flex-col flex-grow relative">
                        <div className="mb-3 text-xs text-sk-accent font-mono uppercase tracking-wider flex items-center gap-2">
                             <Calendar size={12}/> {news.date}
                        </div>
                        <h3 className="text-xl font-bold mb-4 leading-tight text-white group-hover:text-sk-accent transition-colors line-clamp-2">
                        {news.title}
                        </h3>
                        <p className="text-gray-200 text-sm line-clamp-3 leading-relaxed">
                        {news.excerpt}
                        </p>
                    </div>
                    </article>
                </Link>
             ))
          )}

        </div>
      </section>
    </div>
  );
}