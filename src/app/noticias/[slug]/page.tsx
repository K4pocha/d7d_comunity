import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft, Share2, Tag } from "lucide-react";
import newsData from "../../../data/news.json";

// BEST PRACTICE: Generar metadatos dinámicos para SEO (Google leerá el título real de la noticia)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const newsItem = newsData.find((item) => item.slug === slug);
  
  if (!newsItem) return { title: "Noticia no encontrada" };

  return {
    title: `${newsItem.title} | D7D Network`,
    description: newsItem.excerpt,
  };
}

// BEST PRACTICE: Generar rutas estáticas al compilar (SSG)
// Esto hace que la carga sea instantánea porque la página ya está "fabricada" en el servidor.
export async function generateStaticParams() {
  return newsData.map((post) => ({
    slug: post.slug,
  }));
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // En Next.js 15+, params es una promesa que debe resolverse
  const { slug } = await params;

  // Buscamos la noticia en el JSON
  const newsItem = newsData.find((item) => item.slug === slug);

  // UX: Si el slug no existe (ej: /noticias/algo-falso), mandamos al 404 oficial.
  if (!newsItem) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-20">
      
      {/* HEADER CON IMAGEN DE FONDO (Parallax feel) */}
      <div className="relative h-[50vh] w-full border-b border-white/10">
        <Image 
          src={newsItem.image} 
          alt={newsItem.title} 
          fill 
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-4">
          <div className="max-w-4xl mx-auto">
             <Link href="/noticias" className="inline-flex items-center gap-2 text-sk-accent font-bold uppercase tracking-widest text-xs mb-6 hover:underline">
                <ArrowLeft size={16} /> Volver a Noticias
             </Link>
             
             <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-sk-accent text-black font-black text-xs uppercase rounded">
                  {newsItem.category}
                </span>
                <span className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase">
                  <Calendar size={14} /> {newsItem.date}
                </span>
             </div>

             <h1 className="text-4xl md:text-6xl font-black italic uppercase text-white leading-tight mb-8 drop-shadow-lg">
                {newsItem.title}
             </h1>
          </div>
        </div>
      </div>

      {/* CONTENIDO DEL ARTÍCULO */}
      <article className="max-w-4xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          
          {/* Columna Principal: Texto */}
          <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
             {/* Renderizado de HTML seguro. 
                 Nota: En un entorno real con usuarios escribiendo, usaríamos 'dompurify' para evitar XSS.
                 Como es tu JSON local, es seguro. */}
             <div 
                dangerouslySetInnerHTML={{ __html: newsItem.content || newsItem.excerpt }} 
                className="prose prose-invert prose-lg max-w-none prose-p:text-gray-300 prose-headings:text-white prose-headings:italic prose-a:text-sk-accent"
             />
          </div>

          {/* Columna Lateral: Share & Info */}
          <aside className="space-y-8">
            <div className="bg-[#111] border border-white/10 p-6 rounded-xl sticky top-28">
               <h3 className="text-white font-bold uppercase mb-4 flex items-center gap-2">
                 <Share2 size={18} className="text-sk-accent" /> Compartir
               </h3>
               <div className="flex gap-2">
                 <button className="flex-1 py-2 bg-blue-600/20 text-blue-500 border border-blue-600/30 rounded font-bold uppercase text-xs hover:bg-blue-600 hover:text-white transition-colors">
                   Twitter
                 </button>
                 <button className="flex-1 py-2 bg-indigo-600/20 text-indigo-500 border border-indigo-600/30 rounded font-bold uppercase text-xs hover:bg-indigo-600 hover:text-white transition-colors">
                   Discord
                 </button>
               </div>
               
               <div className="mt-8 border-t border-white/10 pt-6">
                 <h4 className="text-gray-500 text-xs uppercase font-bold mb-3 flex items-center gap-2">
                    <Tag size={14} /> Tags Relacionados
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">#Esports</span>
                    <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">#Chile</span>
                    <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">#{newsItem.category}</span>
                 </div>
               </div>
            </div>
          </aside>

        </div>
      </article>

    </div>
  );
}