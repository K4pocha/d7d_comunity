"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Settings, Shield, Cpu, Monitor, Mouse,
  LogOut, CheckCircle2, Save, X, Edit2,
  Lock, Calendar, Globe, User as UserIcon, Gamepad2, AlertCircle // <--- 1. IMPORTANTE: Agregado AlertCircle
} from "lucide-react";
// Asegúrate que la ruta sea correcta según tu estructura de carpetas
import { useAuth } from "../../context/AuthContext"; 

export default function ProfilePage() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    nickname: "",
    role: "",
    avatar: "/fondo.jpg",
    joined: "",
    bio: "",
    cpu: "",
    gpu: "",
    ram: "",
    mouse: "",
    monitor: "",
    // DATOS PERSONALES
    real_name: "",
    birthdate: "",
    gender: "",
    country: "",
    // 2. NUEVOS CAMPOS DE CONEXIÓN
    discord_id: "",
    discord_username: "",
    steam_id: "",
    steam_username: ""
  });

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Error loading profile");
      })
      .then((data) => {
        let formattedBirthdate = "";
        if (data.birthdate) {
          const date = new Date(data.birthdate);
          formattedBirthdate = date.toISOString().split('T')[0];
        }

        setProfile({
          ...data,
          joined: new Date(data.createdAt).toLocaleDateString("es-ES", { month: 'short', year: 'numeric' }),
          avatar: data.avatar || "/fondo.jpg",
          birthdate: formattedBirthdate,
          gender: data.gender || "Prefiero no decir",
          country: data.country || "Chile",
          // Mapeamos también los datos de conexión (si vienen de la API)
          discord_id: data.discord_id,
          discord_username: data.discord_username,
          steam_id: data.steam_id,
          steam_username: data.steam_username
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: any) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] pt-40 text-center text-white">Cargando perfil...</div>;

  return (
    <div className="min-h-screen bg-[#050505] pt-36 pb-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* --- HEADER --- */}
        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 mb-8 overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sk-accent/10 blur-[100px] rounded-full group-hover:bg-sk-accent/20 transition-all duration-500"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#111] ring-2 ring-sk-accent shadow-[0_0_20px_var(--color-sk-accent)] relative">
                <Image src={profile.avatar} alt="Avatar" fill className="object-cover" />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-4xl font-black italic uppercase text-white tracking-wide">{profile.nickname}</h1>
                <span className="px-3 py-1 bg-sk-accent/10 border border-sk-accent/30 text-sk-accent text-xs font-bold uppercase rounded tracking-widest">{profile.role}</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">Miembro desde {profile.joined} • {profile.country}</p>
              <div className="w-full max-w-md bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-sk-accent h-full w-[100%] shadow-[0_0_10px_var(--color-sk-accent)]"></div>
              </div>
            </div>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center gap-2 text-sm font-bold"><Save size={18} /> Guardar</button>
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 text-sm font-bold"><X size={18} /> Cancelar</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors"><Settings size={20} /></button>
              )}
              <button onClick={logout} className="px-6 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all flex items-center gap-2 font-bold text-sm uppercase"><LogOut size={18} /> Salir</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* --- COLUMNA IZQUIERDA --- */}
          <div className="lg:col-span-1 space-y-6">

            {/* 1. SECCIÓN PRIVADA */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Lock size={60} /></div>
              <h3 className="text-xl font-bold uppercase italic text-white mb-6 flex items-center gap-2">
                <UserIcon size={20} className="text-sk-accent" /> Datos Personales
              </h3>

              <div className="space-y-4">
                {/* Nombre Real */}
                <div className="group">
                  <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">Nombre Real (Privado)</label>
                  {isEditing ? (
                    <input type="text" name="real_name" value={profile.real_name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-sk-accent focus:outline-none" placeholder="Nombre completo" />
                  ) : (
                    <div className="text-white font-medium text-sm flex items-center gap-2">
                      {profile.real_name || <span className="text-gray-600 italic">No especificado</span>}
                      {profile.real_name && <Lock size={12} className="text-sk-accent" />}
                    </div>
                  )}
                </div>

                {/* Fecha Nacimiento */}
                <div className="group">
                  <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">Fecha de Nacimiento</label>
                  {isEditing ? (
                    <input type="date" name="birthdate" value={profile.birthdate} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-sk-accent focus:outline-none" />
                  ) : (
                    <div className="text-white font-medium text-sm flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      {profile.birthdate || <span className="text-gray-600 italic">--/--/----</span>}
                    </div>
                  )}
                </div>

                {/* Género y País */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">Género</label>
                    {isEditing ? (
                      <select name="gender" value={profile.gender} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded px-2 py-2 text-white text-xs focus:border-sk-accent focus:outline-none">
                        <option value="Prefiero no decir">Prefiero no decir</option>
                        <option value="Hombre">Hombre</option>
                        <option value="Mujer">Mujer</option>
                        <option value="Otro">Otro</option>
                      </select>
                    ) : (
                      <span className="text-white text-sm">{profile.gender}</span>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">País</label>
                    {isEditing ? (
                      <input type="text" name="country" value={profile.country} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded px-2 py-2 text-white text-xs focus:border-sk-accent focus:outline-none" />
                    ) : (
                      <div className="flex items-center gap-2 text-white text-sm">
                        <Globe size={14} className="text-gray-500" /> {profile.country}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CONEXIONES (DINÁMICA) */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold uppercase italic text-white mb-6 flex items-center gap-2">
                <Shield size={20} className="text-sk-accent" /> Conexiones
              </h3>
              
              <div className="space-y-4">
                  {/* DISCORD */}
                  {profile.discord_id ? (
                      // ESTADO: CONECTADO
                      <div className="flex items-center justify-between p-4 bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Gamepad2 className="text-[#5865F2]" />
                          <div>
                            <p className="text-white font-bold text-sm">Discord</p>
                            <p className="text-[#5865F2] text-xs">@{profile.discord_username || "Usuario"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider">
                            <CheckCircle2 size={18} /> Conectado
                        </div>
                      </div>
                  ) : (
                      // ESTADO: DESCONECTADO
                      <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:bg-[#5865F2]/20 hover:border-[#5865F2]/50 transition-all group">
                        <div className="flex items-center gap-3">
                          <Gamepad2 className="text-white group-hover:text-[#5865F2]" />
                          <div className="text-left">
                            <p className="text-gray-400 group-hover:text-white font-bold text-sm transition-colors">Discord</p>
                            <p className="text-gray-600 group-hover:text-gray-300 text-xs">Vincular cuenta</p>
                          </div>
                        </div>
                        <AlertCircle size={18} className="text-gray-500 group-hover:text-[#5865F2]" />
                      </button>
                  )}

                  {/* STEAM */}
                  {profile.steam_id ? (
                      <div className="flex items-center justify-between p-4 bg-[#1b2838]/50 border border-[#66c0f4]/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Gamepad2 className="text-[#66c0f4]" />
                          <div>
                            <p className="text-white font-bold text-sm">Steam</p>
                            <p className="text-[#66c0f4] text-xs">{profile.steam_username || "Jugador"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider">
                            <CheckCircle2 size={18} /> Conectado
                        </div>
                      </div>
                  ) : (
                      <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:bg-[#1b2838] hover:border-[#66c0f4]/50 transition-all group">
                        <div className="flex items-center gap-3">
                          <Gamepad2 className="text-white group-hover:text-[#66c0f4]" />
                          <div className="text-left">
                            <p className="text-gray-400 group-hover:text-white font-bold text-sm transition-colors">Steam</p>
                            <p className="text-gray-600 group-hover:text-gray-300 text-xs">Vincular cuenta</p>
                          </div>
                        </div>
                        <AlertCircle size={18} className="text-gray-500 group-hover:text-[#66c0f4]" />
                      </button>
                  )}
              </div>
            </div>
          </div>

          {/* --- COLUMNA DERECHA (SETUP) --- */}
          <div className="lg:col-span-2">
            <div className={`bg-[#0a0a0a] border transition-colors rounded-xl p-8 h-full ${isEditing ? "border-sk-accent/50" : "border-white/10"}`}>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black uppercase italic text-white">Gaming Setup</h3>
                {isEditing && <span className="text-xs text-sk-accent animate-pulse font-bold">EDICIÓN HABILITADA</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SetupItem icon={<Cpu size={20} />} label="Procesador" value={profile.cpu} name="cpu" isEditing={isEditing} onChange={handleChange} />
                <SetupItem icon={<Monitor size={20} />} label="Tarjeta Gráfica" value={profile.gpu} name="gpu" isEditing={isEditing} onChange={handleChange} />
                <SetupItem icon={<Cpu size={20} />} label="Memoria RAM" value={profile.ram} name="ram" isEditing={isEditing} onChange={handleChange} />
                <SetupItem icon={<Mouse size={20} />} label="Mouse / Periférico" value={profile.mouse} name="mouse" isEditing={isEditing} onChange={handleChange} />
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h4 className="text-white font-bold uppercase text-sm mb-3 flex items-center gap-2">
                  <Edit2 size={14} className="text-sk-accent" /> Bio / Acerca de mí
                </h4>
                {isEditing ? (
                  <textarea name="bio" value={profile.bio} onChange={handleChange} className="w-full bg-black/20 border border-white/20 rounded p-3 text-white focus:border-sk-accent focus:outline-none min-h-[100px]" placeholder="Escribe algo sobre ti..." />
                ) : (
                  <p className="text-gray-400 leading-relaxed text-sm">{profile.bio || "Este usuario aún no ha escrito su biografía."}</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function SetupItem({ icon, label, value, isEditing, onChange, name }: any) {
  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/5 transition-colors group">
      <div className="flex items-center gap-3 mb-2 text-gray-400 group-hover:text-sk-accent">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      {isEditing ? (
        <input type="text" name={name} value={value} onChange={onChange} className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-white focus:border-sk-accent focus:outline-none text-sm" placeholder="Especificar..." />
      ) : (
        <p className="text-white font-medium">{value || "No especificado"}</p>
      )}
    </div>
  );
}