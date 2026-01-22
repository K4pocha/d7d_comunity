"use client";
import { useState, useEffect } from "react";
import { Trash2, Upload, Image as ImageIcon, Download } from "lucide-react";

export default function AdminMedia() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Formulario
  const [title, setTitle] = useState("");
  const [type, setType] = useState("wallpaper");
  const [file, setFile] = useState<File | null>(null);

  const fetchMedia = async () => {
    const res = await fetch('/api/media');
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchMedia(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return alert("Faltan datos");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("file", file);

    try {
      const res = await fetch('/api/media', { method: 'POST', body: formData });
      if (res.ok) {
        alert("Subido con éxito");
        setTitle("");
        setFile(null);
        fetchMedia();
      } else {
        alert("Error al subir");
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Borrar este archivo?")) return;
    await fetch('/api/media', {
      method: 'DELETE',
      body: JSON.stringify({ id })
    });
    fetchMedia();
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-40">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black uppercase italic text-sk-accent mb-8">Gestión Media Kit</h1>

        {/* FORMULARIO DE SUBIDA */}
        <div className="bg-[#111] p-6 rounded-xl border border-white/10 mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Upload size={20}/> Subir Nuevo Archivo</h2>
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
                <label className="block text-xs uppercase text-gray-500 mb-1">Título</label>
                <input 
                  className="w-full bg-black border border-white/20 p-2 rounded text-white" 
                  value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Wallpaper Worlds 2026" required
                />
            </div>
            <div>
                <label className="block text-xs uppercase text-gray-500 mb-1">Tipo</label>
                <select 
                  className="w-full bg-black border border-white/20 p-2 rounded text-white"
                  value={type} onChange={(e) => setType(e.target.value)}
                >
                  <option value="wallpaper">Wallpaper (PC/Móvil)</option>
                  <option value="logo">Logotipo (PNG/Vector)</option>
                </select>
            </div>
            <div>
                <label className="block text-xs uppercase text-gray-500 mb-1">Archivo</label>
                <input 
                  type="file" 
                  className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sk-accent file:text-black hover:file:bg-white"
                  onChange={(e) => e.target.files && setFile(e.target.files[0])} required
                />
            </div>
            <button type="submit" className="bg-sk-accent text-black font-bold py-2 px-4 rounded hover:brightness-110">
                Subir Archivo
            </button>
          </form>
        </div>

        {/* LISTA DE ARCHIVOS */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {items.map((item) => (
            <div key={item.id} className="group relative bg-[#111] border border-white/10 rounded-lg overflow-hidden">
              <div className="h-40 relative bg-gray-800">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-[10px] uppercase font-bold backdrop-blur-sm border border-white/10">
                    {item.type}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-white truncate mb-4">{item.title}</h3>
                <div className="flex gap-2">
                    <a href={item.image_url} download target="_blank" className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded text-center text-white flex items-center justify-center">
                        <Download size={16} />
                    </a>
                    <button onClick={() => handleDelete(item.id)} className="flex-1 bg-red-500/10 hover:bg-red-500 py-2 rounded text-center text-red-500 hover:text-white flex items-center justify-center transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}