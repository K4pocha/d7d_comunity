"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext"; // Asegúrate que esta ruta sea la correcta en tu proyecto
import { useRouter } from "next/navigation";
import { Save, Image as ImageIcon, Layout } from "lucide-react";

export default function CreateNewsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // ESTADOS SEPARADOS (Para manejar mejor los archivos)
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General"); // Valor por defecto
  const [file, setFile] = useState<File | null>(null); // Estado para el archivo de imagen

  // PROTECCIÓN DE RUTA (FRONTEND)
  useEffect(() => {
    const storedUser = localStorage.getItem("d7d_user");
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'ADMIN') {
            router.push("/");
        }
    } else {
         router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // USAMOS FORMDATA PARA ENVIAR ARCHIVOS Y TEXTO JUNTOS
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    
    // Solo agregamos la imagen si el usuario subió una
    if (file) {
      formData.append("image", file);
    }

    // Enviamos a la API (Nota: No hace falta poner Content-Type, fetch lo detecta solo)
    const res = await fetch("/api/news", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Noticia publicada exitosamente!");
      router.push("/noticias"); // Redirigir al listado
    } else {
      alert("Error al publicar la noticia.");
    }
    setLoading(false);
  };

  // Si no es admin visualmente mostramos nada
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
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Título del Artículo</label>
            <input 
              type="text" 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white font-bold text-lg focus:border-sk-accent focus:outline-none"
              placeholder="Ej: DISP7ACED GANA EL TORNEO REGIONAL"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* CATEGORÍA (NUEVO) */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Categoría</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white font-bold focus:border-sk-accent focus:outline-none cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="General" className="bg-[#0a0a0a]">General</option>
              <option value="Lanzamiento" className="bg-[#0a0a0a]">Lanzamiento</option>
              <option value="Torneos" className="bg-[#0a0a0a]">Torneos</option>
              <option value="Comunidad" className="bg-[#0a0a0a]">Comunidad</option>
              <option value="Actualización" className="bg-[#0a0a0a]">Actualización</option>
            </select>
          </div>

          {/* SUBIR IMAGEN (NUEVO INPUT FILE) */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Imagen de Portada</label>
            <div className="flex gap-2">
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                    <ImageIcon size={20} className="text-gray-400"/>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sk-accent file:text-white hover:file:bg-sk-accent/80 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
            </div>
            <p className="text-[10px] text-gray-500 mt-2">* La imagen se guardará en tu servidor local.</p>
          </div>

          {/* CONTENIDO */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Contenido</label>
            <textarea 
              rows={10}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-sk-accent focus:outline-none leading-relaxed"
              placeholder="Escribe aquí el cuerpo de la noticia..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* BOTÓN SUBMIT */}
          <button 
            disabled={loading}
            className="w-full bg-sk-accent hover:bg-sk-accent/80 text-white font-black uppercase py-4 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Publicando..." : <><Save size={20}/> Publicar Ahora</>}
          </button>

        </form>
      </div>
    </div>
  );
}