"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Shield, Users, FileText, Search, LayoutDashboard, 
  Edit3, Trophy, CheckCircle2, AlertCircle 
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // PROTECCIÓN DE RUTA
  useEffect(() => {
    const storedUser = localStorage.getItem("d7d_user");
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'ADMIN') router.push("/");
    } else {
         router.push("/login");
    }
  }, [router]);

  // CARGAR USUARIOS
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (error) {
      console.error("Error cargando usuarios", error);
    } finally {
      setLoading(false);
    }
  };

  // CAMBIAR ROL
  const handleRoleChange = async (userId: number, newRole: string) => {
    // Optimismo UI: Cambiamos visualmente primero para que se sienta rápido
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole })
      });

      if (!res.ok) throw new Error("Error al cambiar rol");
      
    } catch (error) {
      alert("Error al actualizar el rol en el servidor");
      fetchUsers(); // Revertimos cambios recargando
    }
  };

  // Filtrar usuarios por búsqueda
  const filteredUsers = usersList.filter(u => 
    u.nickname.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-[#050505] pt-36 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER DASHBOARD */}
        <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-6">
          <div className="p-3 bg-sk-accent/10 rounded-xl border border-sk-accent/20">
            <Shield size={32} className="text-sk-accent" />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase italic text-white">Centro de Comando</h1>
            <p className="text-gray-400 text-sm">Bienvenido, Comandante {user.nickname}</p>
          </div>
        </div>

        {/* --- 1. ACCESOS RÁPIDOS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Tarjeta Noticias */}
            <Link href="/admin/crear-noticia" className="group bg-[#0a0a0a] border border-white/10 p-6 rounded-xl hover:border-sk-accent/50 transition-all hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><FileText size={24}/></div>
                    <ArrowIcon />
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-sk-accent">Publicar Noticia</h3>
                <p className="text-sm text-gray-500">Crear nuevos artículos para el blog.</p>
            </Link>

            {/* Tarjeta Torneos (Futuro) */}
            <div className="group bg-[#0a0a0a] border border-white/10 p-6 rounded-xl hover:border-sk-accent/50 transition-all opacity-50 cursor-not-allowed">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400"><Trophy size={24}/></div>
                    <ArrowIcon />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Gestionar Torneos</h3>
                <p className="text-sm text-gray-500">Próximamente disponible.</p>
            </div>

            {/* Tarjeta Stats (Futuro) */}
            <div className="group bg-[#0a0a0a] border border-white/10 p-6 rounded-xl hover:border-sk-accent/50 transition-all opacity-50 cursor-not-allowed">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-500/10 rounded-lg text-green-400"><LayoutDashboard size={24}/></div>
                    <ArrowIcon />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Analíticas</h3>
                <p className="text-sm text-gray-500">Próximamente disponible.</p>
            </div>
        </div>

        {/* --- 2. GESTIÓN DE USUARIOS --- */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
            
            {/* Barra de Herramientas de la Tabla */}
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="text-xl font-bold uppercase italic text-white flex items-center gap-2">
                    <Users size={20} className="text-sk-accent"/> Base de Datos de Usuarios
                </h3>
                
                {/* Buscador */}
                <div className="relative w-full md:w-64">
                    <Search size={16} className="absolute left-3 top-3 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nick o email..." 
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white text-sm focus:border-sk-accent focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-xs uppercase font-bold text-gray-400 tracking-wider">
                        <tr>
                            <th className="p-4">Usuario</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Fecha Registro</th>
                            <th className="p-4">Rol / Permisos</th>
                            <th className="p-4 text-right">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                             <tr><td colSpan={5} className="p-8 text-center text-gray-500">Cargando datos...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                             <tr><td colSpan={5} className="p-8 text-center text-gray-500">No se encontraron usuarios.</td></tr>
                        ) : (
                            filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-gray-800 overflow-hidden relative">
                                                 <Image src={u.avatar || "/fondo.jpg"} alt={u.nickname} fill className="object-cover" />
                                            </div>
                                            <span className="font-bold text-white text-sm">{u.nickname}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-400 text-sm">{u.email}</td>
                                    <td className="p-4 text-gray-500 text-xs font-mono">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <select 
                                            value={u.role} 
                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                            className={`
                                                bg-black border border-white/10 rounded px-2 py-1 text-xs font-bold uppercase focus:outline-none cursor-pointer
                                                ${u.role === 'ADMIN' ? 'text-red-500 border-red-500/30' : 
                                                  u.role === 'MOD' ? 'text-purple-500 border-purple-500/30' : 
                                                  'text-green-500 border-green-500/30'}
                                            `}
                                        >
                                            <option value="USER">User</option>
                                            <option value="MOD">Mod</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                                            <CheckCircle2 size={10} /> Activo
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
}

// Icono auxiliar
const ArrowIcon = () => (
    <svg className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);