"use client";

import { useState, useEffect } from "react";
import { Edit, Save, X, Trash2, Plus, User, MousePointer2, Monitor, Keyboard, RefreshCw, Upload } from "lucide-react";

export default function AdminEquipos() {
  const [teams, setTeams] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [teamForm, setTeamForm] = useState<any>({});
  
  const [rosterList, setRosterList] = useState<any[]>([]);
  
  // FORMULARIO DE JUGADOR
  const [playerForm, setPlayerForm] = useState({
    id: null, nickname: "", role: "", country: "CL", bio: "", 
    photo_url: "", // URL existente
    twitter: "", twitch: "", instagram: "",
    mouse: "", keyboard: "", monitor: ""
  });
  
  // NUEVO: Estado para el archivo de imagen
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => { fetchTeams(); }, []);

  const fetchTeams = async () => {
    const res = await fetch('/api/teams');
    const data = await res.json();
    setTeams(data);
  };

  const fetchRoster = async (gameId: number) => {
    const res = await fetch(`/api/roster?game_id=${gameId}`);
    const data = await res.json();
    setRosterList(data);
  };

  const handleEditClick = (team: any) => {
    setEditingId(team.id);
    setTeamForm(team);
    fetchRoster(team.id);
    resetPlayerForm();
  };

  // Guardar Equipo (JSON simple)
  const handleSaveTeam = async () => {
    try {
      const res = await fetch('/api/teams', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamForm),
      });
      if (res.ok) {
        setEditingId(null);
        fetchTeams();
        alert("Equipo actualizado correctamente");
      }
    } catch (error) { console.error(error); }
  };

  // --- LÓGICA DE JUGADORES ---

  const handlePlayerChange = (e: any) => {
    setPlayerForm({ ...playerForm, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setPhotoFile(e.target.files[0]);
    }
  };

  const resetPlayerForm = () => {
    setPlayerForm({
        id: null, nickname: "", role: "", country: "CL", bio: "", photo_url: "",
        twitter: "", twitch: "", instagram: "",
        mouse: "", keyboard: "", monitor: ""
    });
    setPhotoFile(null); // Limpiar archivo
  };

  const loadPlayerForEdit = (player: any) => {
    const socials = typeof player.socials === 'string' ? JSON.parse(player.socials) : player.socials || {};
    const setup = typeof player.setup === 'string' ? JSON.parse(player.setup) : player.setup || {};

    setPlayerForm({
        id: player.id, nickname: player.nickname, role: player.role, country: player.country,
        bio: player.bio || "", photo_url: player.photo_url || "",
        twitter: socials.twitter || "", twitch: socials.twitch || "", instagram: socials.instagram || "",
        mouse: setup.mouse || "", keyboard: setup.keyboard || "", monitor: setup.monitor || ""
    });
    setPhotoFile(null); // Reiniciamos el archivo al editar otro
  };

  // GUARDAR JUGADOR CON FORM DATA (Para subir archivo)
  const handleSavePlayer = async () => {
    if (!playerForm.nickname || !playerForm.role) return alert("Falta Nickname o Rol");

    const method = playerForm.id ? 'PUT' : 'POST';
    
    // Usamos FormData para enviar archivo + texto
    const formData = new FormData();
    if (playerForm.id) formData.append("id", String(playerForm.id));
    formData.append("game_id", String(editingId));
    formData.append("nickname", playerForm.nickname);
    formData.append("role", playerForm.role);
    formData.append("country", playerForm.country);
    formData.append("bio", playerForm.bio);
    
    // Periféricos
    formData.append("mouse", playerForm.mouse);
    formData.append("keyboard", playerForm.keyboard);
    formData.append("monitor", playerForm.monitor);

    // Redes
    formData.append("twitter", playerForm.twitter);
    formData.append("twitch", playerForm.twitch);
    formData.append("instagram", playerForm.instagram);

    // IMAGEN
    if (photoFile) {
        formData.append("photo_file", photoFile); // Nuevo archivo
    }
    // Enviamos también la URL antigua por si no suben archivo nuevo
    formData.append("existing_photo_url", playerForm.photo_url);

    try {
      const res = await fetch('/api/roster', {
        method: method,
        body: formData, // <--- Enviamos FormData, no JSON
      });

      if (res.ok) {
        fetchRoster(editingId!);
        resetPlayerForm();
      } else {
        alert("Error al guardar jugador");
      }
    } catch (error) { alert("Error de conexión"); }
  };

  const handleDeletePlayer = async (playerId: number) => {
    if(!confirm("¿Eliminar jugador?")) return;
    await fetch('/api/roster', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: playerId }),
    });
    fetchRoster(editingId!);
  };

  const handleTeamChange = (e: any) => { setTeamForm({ ...teamForm, [e.target.name]: e.target.value }); };

  return (
    // CAMBIO 1: Aumenté a pt-52 para que baje más
    <div className="min-h-screen bg-black text-white p-4 md:p-10 pt-52">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-sk-accent uppercase">Panel de Administración: Equipos</h1>

        <div className="grid gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-[#111] border border-white/10 p-6 rounded-lg flex flex-col gap-6">
              
              {editingId === team.id ? (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* EDITAR EQUIPO */}
                  <div className="border-b border-white/10 pb-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Edit size={20}/> Editar Información</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="name" value={teamForm.name} onChange={handleTeamChange} className="bg-black border border-white/20 p-2 rounded text-white" placeholder="Nombre" />
                        <select name="status" value={teamForm.status} onChange={handleTeamChange} className="bg-black border border-white/20 p-2 rounded text-white">
                            <option value="Activo">Activo</option>
                            <option value="Reclutando">Reclutando</option>
                            <option value="Próximamente">Próximamente</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                        <input name="slug" value={teamForm.slug} onChange={handleTeamChange} className="bg-black border border-white/20 p-2 rounded text-white" placeholder="Slug (URL)" />
                        <input name="image_url" value={teamForm.image_url} onChange={handleTeamChange} className="bg-black border border-white/20 p-2 rounded text-white" placeholder="URL Imagen Fondo" />
                        <textarea name="description" rows={2} value={teamForm.description} onChange={handleTeamChange} className="md:col-span-2 bg-black border border-white/20 p-2 rounded text-white" placeholder="Descripción" />
                      </div>
                      <div className="flex gap-2 justify-end mt-4">
                        <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-700 rounded flex items-center gap-2"><X size={16}/> Cancelar</button>
                        <button onClick={handleSaveTeam} className="px-4 py-2 bg-green-600 rounded flex items-center gap-2"><Save size={16}/> Guardar Info</button>
                      </div>
                  </div>

                  {/* GESTIONAR ROSTER */}
                  <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><User size={20}/> Gestionar Roster</h3>
                      
                      {/* Lista */}
                      <div className="space-y-2 mb-6">
                        {rosterList.length > 0 ? (
                           rosterList.map(player => (
                             <div key={player.id} className="flex items-center justify-between bg-white/5 p-3 rounded border border-white/10 hover:border-sk-accent/50 transition-colors">
                                <div className="flex items-center gap-3">
                                   {/* Mini preview de foto si existe */}
                                   <div className="w-8 h-8 bg-black rounded-full overflow-hidden border border-sk-accent">
                                      {player.photo_url ? <img src={player.photo_url} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xs font-bold">{player.country}</div>}
                                   </div>
                                   <div>
                                      <p className="font-bold text-white text-sm">{player.nickname} <span className="text-gray-500 font-normal">({player.role})</span></p>
                                   </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => loadPlayerForEdit(player)} className="text-blue-400 hover:bg-white/10 p-2 rounded" title="Editar Jugador">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDeletePlayer(player.id)} className="text-red-500 hover:bg-white/10 p-2 rounded" title="Eliminar">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                             </div>
                           ))
                        ) : <p className="text-gray-500 text-sm italic">Sin jugadores.</p>}
                      </div>

                      {/* Formulario JUGADOR */}
                      <div className={`border p-4 rounded-lg transition-colors ${playerForm.id ? 'bg-blue-900/10 border-blue-500/30' : 'bg-sk-accent/5 border-sk-accent/20'}`}>
                         <h4 className={`text-sm font-bold uppercase mb-3 flex items-center gap-2 ${playerForm.id ? 'text-blue-400' : 'text-sk-accent'}`}>
                            {playerForm.id ? <><RefreshCw size={16}/> Editando a {playerForm.nickname}</> : <><Plus size={16}/> Añadir Nuevo Integrante</>}
                         </h4>
                         
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Básicos */}
                            <input name="nickname" placeholder="Nickname" value={playerForm.nickname} onChange={handlePlayerChange} className="bg-black border border-white/20 p-2 rounded text-sm text-white" />
                            <input name="role" placeholder="Rol" value={playerForm.role} onChange={handlePlayerChange} className="bg-black border border-white/20 p-2 rounded text-sm text-white" />
                            <input name="country" placeholder="País (CL)" value={playerForm.country} onChange={handlePlayerChange} className="bg-black border border-white/20 p-2 rounded text-sm text-white" />
                            
                            {/* CAMBIO 2: Input File para Foto */}
                            <div className="md:col-span-3">
                                <label className="block text-xs text-gray-500 mb-1 uppercase">Foto del Jugador</label>
                                <div className="flex gap-2 items-center">
                                    <label className="flex items-center gap-2 cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-2 rounded border border-white/20 transition-colors">
                                        <Upload size={16} />
                                        <span className="text-sm">Subir Archivo</span>
                                        <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                                    </label>
                                    <span className="text-xs text-gray-400 italic">
                                        {photoFile ? photoFile.name : (playerForm.photo_url ? "Imagen actual guardada" : "Sin archivo seleccionado")}
                                    </span>
                                </div>
                            </div>
                            
                            <input name="bio" placeholder="Biografía..." value={playerForm.bio} onChange={handlePlayerChange} className="bg-black border border-white/20 p-2 rounded text-sm text-white md:col-span-3" />

                            {/* Redes */}
                            <input name="twitter" placeholder="Link Twitter" value={playerForm.twitter} onChange={handlePlayerChange} className="bg-black border border-white/20 p-2 rounded text-sm text-white" />
                            <input name="twitch" placeholder="Link Twitch" value={playerForm.twitch} onChange={handlePlayerChange} className="bg-black border border-white/20 p-2 rounded text-sm text-white" />
                            <input name="instagram" placeholder="Link Instagram" value={playerForm.instagram} onChange={handlePlayerChange} className="bg-black border border-white/20 p-2 rounded text-sm text-white" />

                            {/* Setup */}
                            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-white/10 pt-3 mt-1">
                                <div className="relative">
                                    <MousePointer2 size={14} className="absolute left-3 top-3 text-gray-500"/>
                                    <input name="mouse" placeholder="Mouse" value={playerForm.mouse} onChange={handlePlayerChange} className="bg-black border border-white/20 p-2 pl-9 rounded text-sm text-white w-full" />
                                </div>
                                <div className="relative">
                                    <Keyboard size={14} className="absolute left-3 top-3 text-gray-500"/>
                                    <input name="keyboard" placeholder="Teclado" value={playerForm.keyboard} onChange={handlePlayerChange} className="bg-black border border-white/20 p-2 pl-9 rounded text-sm text-white w-full" />
                                </div>
                                <div className="relative">
                                    <Monitor size={14} className="absolute left-3 top-3 text-gray-500"/>
                                    <input name="monitor" placeholder="Monitor" value={playerForm.monitor} onChange={handlePlayerChange} className="bg-black border border-white/20 p-2 pl-9 rounded text-sm text-white w-full" />
                                </div>
                            </div>
                         </div>

                         <div className="flex gap-2 mt-4">
                             {playerForm.id && (
                                 <button onClick={resetPlayerForm} className="w-1/4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold uppercase text-xs rounded">
                                     Cancelar
                                 </button>
                             )}
                             <button onClick={handleSavePlayer} className={`flex-grow py-2 font-bold uppercase text-xs tracking-widest rounded transition-colors text-white ${playerForm.id ? 'bg-blue-600 hover:bg-blue-500' : 'bg-sk-accent hover:bg-pink-600'}`}>
                                {playerForm.id ? 'Guardar Cambios' : 'Agregar al Roster'}
                             </button>
                         </div>
                      </div>
                  </div>
                </div>
              ) : (
                /* MODO LECTURA */
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold italic">{team.name}</h2>
                        <span className={`text-xs px-2 py-1 rounded border ${team.status === 'Activo' ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}`}>{team.status}</span>
                    </div>
                    <p className="text-gray-600 text-xs font-mono">/equipos/{team.slug}</p>
                  </div>
                  <button onClick={() => handleEditClick(team)} className="bg-white/5 hover:bg-sk-accent hover:text-white text-gray-300 px-6 py-3 rounded border border-white/10 transition-colors flex items-center gap-2">
                      <Edit size={18} /> Gestionar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}