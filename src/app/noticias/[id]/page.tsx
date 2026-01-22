"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Layout, Share2, Trash2, Twitter, Facebook, Link as LinkIcon } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function ArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. CARGAR NOTICIA
  useEffect(() => {
    if (id) {
      // Intentamos cargar por ID (asumiendo que tu API soporta ?id=X o traemos todas)
      fetch(`/api/news?id=${id}`)
        .then((res) => {
             // Fallback común: si el endpoint singular falla, traemos la lista y filtramos
             if (!res.ok) return fetch('/api/news').then(r => r.json()).then(list => list.find((n:any) => n.id == id));
             return res.json();
        })
        .then((data) => {
          // Si la API devolvió un array (por el fallback), buscamos el objeto
          const item = Array.isArray(data) ? data.find((n:any) => n.id == id) : data;
          
          if (!item) throw new Error("Noticia no encontrada");

          setNews({
            ...item,
            date: new Date(item.created_at).toLocaleDateString("es-ES", { day: 'numeric', month: 'long', year: 'numeric' }),
            image: item.image || "/news-placeholder.jpg",
            author_name: item.author_name || "Admin D7D",
            category: item.category || "General",
            summary: item.summary || "" // <--- Cargamos el resumen
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  // 2. FUNCIÓN ELIMINAR (Corregida con body JSON)
  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar esta noticia?")) return;

    try {
        const res = await fetch(`/api/news`, { 
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: news.id }) 
        });

        if (res.ok) {
            alert("Noticia eliminada correctamente");
            router.push("/noticias");
            router.refresh();
        } else {
            alert("Error al eliminar");
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
  };

  // 3. FUNCIÓN COMPARTIR (Nativa Móvil)
  const handleNativeShare = async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: news.title,
                text: news.summary || news.title, // Usamos el resumen si existe
                url: window.location.href,
            });
        } catch (error) { console.log("Cancelado"); }
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert("¡Enlace copiado al portapapeles!");
    }
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(news.title);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] pt-40 flex flex-col items-center justify-center text-white gap-4">
        <Layout className="animate-pulse text-sk-accent" size={48} />
        <p className="uppercase tracking-widest text-sm font-bold">Cargando Artículo...</p>
    </div>
  );

  if (!news) return (
    <div className="min-h-screen bg-[#050505] pt-40 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-black uppercase text-gray-500 mb-4">404</h1>
        <p className="uppercase tracking-widest text-sm font-bold mb-8">Noticia no encontrada</p>
        <Link href="/noticias" className="text-sk-accent hover:underline">Volver a Noticias</Link>
    </div>
  );

  return (
    <article className="min-h-screen bg-[#050505] pb-20">
      
      {/* HERO BANNER */}
      <div className="relative w-full h-[60vh] min-h-[500px] border-b border-white/10">
        <Image 
          src={news.image} 
          alt={news.title} 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-black/20" />
        
        <div className="absolute bottom-0 left-0 w-full">
            <div className="max-w-7xl mx-auto px-4 pb-12 md:pb-16">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <Link href="/noticias" className="inline-flex items-center gap-2 text-sk-accent hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
                        <ArrowLeft size={16} /> Volver a Noticias
                    </Link>
                    <span className="text-gray-500">|</span>
                    <span className="px-3 py-1 bg-sk-accent text-black text-xs font-black uppercase rounded">
                        {news.category}
                    </span>
                    <span className="flex items-center gap-2 text-gray-300 text-xs font-bold uppercase">
                        <Calendar size={14} /> {news.date}
                    </span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black italic text-white uppercase leading-[0.95] drop-shadow-2xl tracking-tighter max-w-5xl">
                    {news.title}
                </h1>
            </div>
        </div>
      </div>

      {/* CUERPO DEL ARTÍCULO */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* COLUMNA IZQUIERDA: Contenido */}
            <div className="lg:col-span-8">
                {/* Info Autor */}
                <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
                    <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-white">
                         <User size={20} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-widest">Escrito por</p>
                        <p className="text-white font-bold">{news.author_name}</p>
                    </div>
                </div>

                {/* --- AQUÍ ESTÁ LA MAGIA: BAJADA DESTACADA --- */}
                {news.summary && (
                    <div className="mb-10 text-xl md:text-2xl text-white font-light leading-relaxed italic border-l-4 border-sk-accent pl-6 py-2 bg-white/5 rounded-r-lg">
                        "{news.summary}"
                    </div>
                )}

                {/* Texto Principal */}
                <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed font-sans marker:text-sk-accent">
                    <div className="whitespace-pre-wrap">
                        {news.content}
                    </div>
                </div>
            </div>

            {/* COLUMNA DERECHA: Sidebar */}
            <div className="lg:col-span-4 space-y-8">
                
                {/* CAJA DE COMPARTIR */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 sticky top-24">
                    <h3 className="text-white font-bold uppercase text-sm mb-4 flex items-center gap-2">
                        <Share2 size={16} className="text-sk-accent"/> Compartir
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-3 mb-4">
                         <button onClick={handleNativeShare} className="flex items-center justify-center gap-2 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-all font-bold text-xs uppercase">
                            <Share2 size={16} /> Compartir / Copiar Link
                         </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button onClick={shareTwitter} className="flex items-center justify-center gap-2 py-3 bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/20 rounded-lg hover:bg-[#1DA1F2] hover:text-white transition-all font-bold text-xs uppercase">
                            <Twitter size={16} /> Twitter
                        </button>
                        <button onClick={shareFacebook} className="flex items-center justify-center gap-2 py-3 bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20 rounded-lg hover:bg-[#1877F2] hover:text-white transition-all font-bold text-xs uppercase">
                            <Facebook size={16} /> Facebook
                        </button>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                         <p className="text-gray-500 text-xs mb-3 font-bold uppercase">Tags Relacionados</p>
                         <div className="flex flex-wrap gap-2">
                             <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">#Esports</span>
                             <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">#{news.category}</span>
                         </div>
                    </div>

                    {/* BOTÓN DE BORRAR (SOLO ADMIN) */}
                    {user && user.role === 'ADMIN' && (
                        <div className="border-t border-white/10 pt-6 mt-6">
                            <button 
                                onClick={handleDelete}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all font-bold text-xs uppercase"
                            >
                                <Trash2 size={16} /> Eliminar Noticia
                            </button>
                        </div>
                    )}
                </div>

            </div>

        </div>
      </div>

    </article>
  );
}