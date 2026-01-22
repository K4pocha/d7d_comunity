"use client";

import { useState, useEffect } from "react";
// import Image from "next/image"; <--- YA NO LO USAMOS PARA NOTICIAS DINÁMICAS
import Link from "next/link";
import { Calendar, ArrowRight, Filter, Layout } from "lucide-react";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todas");

  // 1. CARGAR DATOS REALES
  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        const formattedNews = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          image: item.image || "/news-placeholder.jpg",
          category: item.category || "General",
          date: new Date(item.created_at).toLocaleDateString("es-ES", { day: 'numeric', month: 'short', year: 'numeric' }),
          
          // <--- CAMBIO 1: Lógica de Resumen (Bajada)
          excerpt: item.summary || (item.content ? item.content.substring(0, 150) + "..." : "Leer más..."),
          
          slug: item.id 
        }));
        
        setNews(formattedNews);
        setLoading(false);
      })
      .catch((err) => console.error("Error cargando noticias:", err));
  }, []);

  // 2. EXTRAER CATEGORÍAS
  const categories = ["Todas", ...new Set(news.map((item) => item.category))];

  // 3. FILTRADO
  const filteredNews = filter === "Todas" 
    ? news 
    : news.filter(n => n.category === filter);

  // Separamos Hero y Grid
  const heroNews = filteredNews[0];
  const gridNews = filteredNews.slice(1);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] pt-40 flex flex-col items-center justify-center text-white gap-4">
        <Layout className="animate-bounce text-sk-accent" size={48} />
        <p className="uppercase tracking-widest text-sm font-bold">Cargando Novedades...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] pt-36 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER & FILTROS */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6 gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-black italic uppercase text-white tracking-tighter mb-2">
              News<span className="text-sk-accent">room</span>
            </h1>
            <p className="text-gray-400 text-sm uppercase tracking-widest">Actualidad del ecosistema D7D</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat as string}
                onClick={() => setFilter(cat as string)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                  filter === cat
                    ? "bg-sk-accent text-white border-sk-accent shadow-[0_0_15px_var(--color-sk-accent)]"
                    : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat as string}
              </button>
            ))}
          </div>
        </div>

        {/* ESTADO VACÍO */}
        {filteredNews.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Filter size={48} className="mx-auto mb-4 opacity-20" />
            <p>No hay noticias disponibles aún.</p>
          </div>
        )}

        {/* NOTICIA DESTACADA (HERO) */}
        {heroNews && (
          <Link href={`/noticias/${heroNews.id}`} className="group relative block w-full h-[500px] rounded-2xl overflow-hidden mb-12 border border-white/10">
            
            {/* <--- CAMBIO 2: ETIQUETA IMG NORMAL */}
            <img 
              src={heroNews.image} 
              alt={heroNews.title} 
              className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105" 
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-sk-accent text-black font-black text-xs uppercase rounded">
                  {heroNews.category}
                </span>
                <span className="flex items-center gap-2 text-gray-300 text-xs font-bold uppercase">
                  <Calendar size={14} /> {heroNews.date}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase leading-tight mb-4 group-hover:text-sk-accent transition-colors">
                {heroNews.title}
              </h2>
              <p className="text-gray-300 line-clamp-2 md:text-lg mb-6 drop-shadow-md">
                {heroNews.excerpt}
              </p>
              <span className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-widest border-b-2 border-sk-accent pb-1 group-hover:gap-4 transition-all">
                Leer Artículo <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        )}

        {/* GRID DE NOTICIAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridNews.map((news) => (
            <Link key={news.id} href={`/noticias/${news.id}`} className="group bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-sk-accent/50 transition-all hover:-translate-y-1 flex flex-col h-full">
              <div className="relative h-48 w-full overflow-hidden shrink-0">
                
                {/* <--- CAMBIO 2: ETIQUETA IMG NORMAL */}
                <img 
                  src={news.image} 
                  alt={news.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                
                <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-black/80 backdrop-blur text-white text-[10px] font-bold uppercase rounded border border-white/10">
                      {news.category}
                    </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-3">
                  <Calendar size={12} /> {news.date}
                </div>
                <h3 className="text-xl font-black italic text-white uppercase leading-snug mb-3 line-clamp-2 group-hover:text-sk-accent transition-colors">
                  {news.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed flex-grow">
                  {news.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-end text-sk-accent text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                  Leer más <ArrowRight size={12} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}