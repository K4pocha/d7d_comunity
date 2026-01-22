"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Save, Image as ImageIcon, Layout } from "lucide-react";

export default function CreateNewsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState(""); // <--- NUEVO ESTADO
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("d7d_user");
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'ADMIN') router.push("/");
    } else {
         router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary); // <--- ENVIAMOS EL RESUMEN
    formData.append("content", content);
    formData.append("category", category);
    
    if (file) formData.append("image", file);

    const res = await fetch("/api/news", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Noticia publicada exitosamente!");
      router.push("/noticias");
    } else {
      alert("Error al publicar la noticia.");
    }
    setLoading(false);
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-[#050505] pt-36 px-4">
      <div className="max-w-3xl mx-auto bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
        
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
            <Layout className="text-sk-accent" size={32} />
            <div>
                <h1 className="text-3xl font-black uppercase italic text-white">Publicar Noticia</h1>
                <p className="text-gray-500 text-sm">Panel de Administrador</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* TÍTULO */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Título</label>
            <input 
              type="text" 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white font-bold text-lg focus:border-sk-accent focus:outline-none"
              placeholder="Ej: DISP7ACED GANA EL TORNEO"
              value={title} onChange={(e) => setTitle(e.target.value)} required
            />
          </div>

          {/* BAJADA / RESUMEN (NUEVO) */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Bajada (Resumen)</label>
            <textarea 
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white text-sm focus:border-sk-accent focus:outline-none resize-none"
              placeholder="Resumen corto que aparecerá en la tarjeta..."
              value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={250} required
            />
            <p className="text-[10px] text-gray-500 text-right mt-1">{summary.length}/250</p>
          </div>

          {/* CATEGORÍA */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Categoría</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white font-bold focus:border-sk-accent focus:outline-none cursor-pointer"
              value={category} onChange={(e) => setCategory(e.target.value)}
            >
              <option value="General" className="bg-[#0a0a0a]">General</option>
              <option value="Lanzamiento" className="bg-[#0a0a0a]">Lanzamiento</option>
              <option value="Torneos" className="bg-[#0a0a0a]">Torneos</option>
              <option value="Comunidad" className="bg-[#0a0a0a]">Comunidad</option>
              <option value="Actualización" className="bg-[#0a0a0a]">Actualización</option>
            </select>
          </div>

          {/* IMAGEN */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Imagen de Portada</label>
            <div className="flex gap-2">
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                    <ImageIcon size={20} className="text-gray-400"/>
                </div>
                <input 
                  type="file" accept="image/*"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sk-accent file:text-white hover:file:bg-sk-accent/80 cursor-pointer"
                  onChange={(e) => { if (e.target.files && e.target.files[0]) setFile(e.target.files[0]); }}
                />
            </div>
          </div>

          {/* CONTENIDO */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Cuerpo de la Noticia</label>
            <textarea 
              rows={12}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-sk-accent focus:outline-none leading-relaxed"
              placeholder="Escribe aquí el contenido completo..."
              value={content} onChange={(e) => setContent(e.target.value)} required
            />
          </div>

          <button disabled={loading} className="w-full bg-sk-accent hover:bg-sk-accent/80 text-white font-black uppercase py-4 rounded-lg transition-all flex items-center justify-center gap-2">
            {loading ? "Publicando..." : <><Save size={20}/> Publicar Ahora</>}
          </button>

        </form>
      </div>
    </div>
  );
}