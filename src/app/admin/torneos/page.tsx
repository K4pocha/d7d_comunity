"use client";
import { useState, useEffect } from "react";
import { Plus, Save, Settings, Trophy } from "lucide-react";

export default function AdminTournaments() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  
  // Estado para crear nuevo
  const [newTitle, setNewTitle] = useState("");
  const [newGame, setNewGame] = useState("Valorant");

  useEffect(() => { loadTournaments(); }, []);

  const loadTournaments = () => {
    fetch('/api/tournaments').then(r => r.json()).then(setTournaments);
  };

  const handleCreate = async () => {
    if(!newTitle) return alert("Ponle un nombre al torneo");
    await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, game: newGame, start_date: new Date() })
    });
    setNewTitle("");
    loadTournaments();
  };

  const handleUpdate = async () => {
    if (!selectedTournament) return;
    await fetch('/api/tournaments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedTournament)
    });
    alert("¡Torneo actualizado correctamente!");
    loadTournaments();
  };

  // Función para editar una partida específica en el bracket
  const updateMatch = (rIndex: number, mIndex: number, field: string, value: any) => {
     const newData = { ...selectedTournament };
     newData.bracket_data.rounds[rIndex].matches[mIndex][field] = value;
     setSelectedTournament(newData);
  };

  // Helper para actualizar inputs de texto fácilmente
  const handleChange = (field: string, value: string) => {
      setSelectedTournament({ ...selectedTournament, [field]: value });
  };

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4 md:px-10">
      <h1 className="text-4xl font-black uppercase text-sk-accent mb-8">Gestión de Torneos</h1>

      {/* CREAR NUEVO */}
      <div className="bg-[#111] p-6 rounded-2xl border border-white/10 mb-8 flex flex-col md:flex-row gap-4 md:items-end shadow-lg">
         <div className="flex-grow">
            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Nombre del Torneo</label>
            <input 
                className="w-full bg-black border border-white/20 p-3 text-white rounded-lg focus:border-sk-accent focus:outline-none transition-colors" 
                placeholder="Ej: Liga de Verano 2026"
                value={newTitle} 
                onChange={e => setNewTitle(e.target.value)} 
            />
         </div>
         <div className="w-full md:w-64">
            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Juego</label>
            <select 
                className="w-full bg-black border border-white/20 p-3 text-white rounded-lg focus:border-sk-accent focus:outline-none transition-colors" 
                value={newGame} 
                onChange={e => setNewGame(e.target.value)}
            >
                <option>Valorant</option>
                <option>CS2</option>
                <option>League of Legends</option>
                <option>Rocket League</option>
            </select>
         </div>
         <button onClick={handleCreate} className="bg-sk-accent hover:bg-sk-accent/80 text-black font-black px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <Plus size={20}/> Crear Torneo
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
         
         {/* LISTA IZQUIERDA (Torneos Existentes) */}
         <div className="space-y-3 bg-[#111] p-4 rounded-2xl border border-white/10">
            <h3 className="font-bold text-gray-400 uppercase text-xs mb-4">Selecciona para editar</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20">
                {tournaments.map(t => (
                    <div 
                        key={t.id} 
                        onClick={() => {
                            const parsed = typeof t.bracket_data === 'string' ? JSON.parse(t.bracket_data) : t.bracket_data;
                            setSelectedTournament({...t, bracket_data: parsed});
                        }} 
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${selectedTournament?.id === t.id ? 'border-sk-accent bg-sk-accent/10 shadow-[0_0_15px_rgba(var(--sk-accent-rgb),0.2)]' : 'border-white/5 bg-black hover:bg-white/5'}`}
                    >
                        <h3 className="font-black text-sm text-white truncate">{t.title}</h3>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] uppercase font-bold bg-white/10 px-2 py-1 rounded text-gray-300">{t.game}</span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${t.status === 'En Curso' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400'}`}>
                                {t.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
         </div>

         {/* EDITOR DERECHA */}
         <div className="lg:col-span-2 space-y-6">
            {selectedTournament ? (
                <>
                    {/* Tarjeta de Configuración General */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-lg">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b border-white/10 pb-4 gap-4">
                            <h2 className="text-xl font-black text-white flex items-center gap-2">
                                <Settings className="text-sk-accent" /> Editando: {selectedTournament.title}
                            </h2>
                            <div className="flex gap-2">
                                <select 
                                    value={selectedTournament.status} 
                                    onChange={(e) => handleChange("status", e.target.value)}
                                    className="bg-black border border-white/20 rounded-lg p-2 text-sm text-white font-bold"
                                >
                                    <option>Inscripciones</option><option>En Curso</option><option>Finalizado</option>
                                </select>
                                <button onClick={handleUpdate} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold flex gap-2 text-sm items-center transition-colors">
                                    <Save size={16}/> Guardar Todo
                                </button>
                            </div>
                        </div>

                        {/* Formulario de Detalles (Grilla) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="md:col-span-3">
                                <label className="text-[10px] text-gray-500 uppercase font-black tracking-wider mb-1 block">URL del Banner (Fondo)</label>
                                <input className="w-full bg-black border border-white/10 p-2.5 text-white rounded-lg text-sm focus:border-sk-accent outline-none" placeholder="/valo-fondo.png" value={selectedTournament.banner_url || ""} onChange={e => handleChange("banner_url", e.target.value)} />
                            </div>
                            
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-black tracking-wider mb-1 block">Modo de Juego</label>
                                <input className="w-full bg-black border border-white/10 p-2.5 text-white rounded-lg text-sm focus:border-sk-accent outline-none" placeholder="5v5, 1v1..." value={selectedTournament.mode || ""} onChange={e => handleChange("mode", e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-black tracking-wider mb-1 block">Formato</label>
                                <input className="w-full bg-black border border-white/10 p-2.5 text-white rounded-lg text-sm focus:border-sk-accent outline-none" placeholder="BO1, BO3..." value={selectedTournament.format || ""} onChange={e => handleChange("format", e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-black tracking-wider mb-1 block">Región</label>
                                <input className="w-full bg-black border border-white/10 p-2.5 text-white rounded-lg text-sm focus:border-sk-accent outline-none" placeholder="LATAM" value={selectedTournament.region || ""} onChange={e => handleChange("region", e.target.value)} />
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-black tracking-wider mb-1 block">Tipo de Bracket</label>
                                <input className="w-full bg-black border border-white/10 p-2.5 text-white rounded-lg text-sm focus:border-sk-accent outline-none" placeholder="Double Elimination" value={selectedTournament.type || ""} onChange={e => handleChange("type", e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-black tracking-wider mb-1 block">Cupos Disponibles</label>
                                <input className="w-full bg-black border border-white/10 p-2.5 text-white rounded-lg text-sm focus:border-sk-accent outline-none" placeholder="0 / 16" value={selectedTournament.slots || ""} onChange={e => handleChange("slots", e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[10px] text-green-500 uppercase font-black tracking-wider mb-1 block">Costo Inscripción</label>
                                <input className="w-full bg-black border border-green-500/30 p-2.5 text-white rounded-lg text-sm focus:border-green-500 outline-none" placeholder="GRATIS o $5.000" value={selectedTournament.entry_fee || ""} onChange={e => handleChange("entry_fee", e.target.value)} />
                            </div>

                            <div>
                                <label className="text-[10px] text-yellow-500 uppercase font-black tracking-wider mb-1 block">Premio 1° Lugar</label>
                                <input className="w-full bg-black border border-yellow-500/30 p-2.5 text-white rounded-lg text-sm focus:border-yellow-500 outline-none" placeholder="$100 USD" value={selectedTournament.prize_1 || ""} onChange={e => handleChange("prize_1", e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1 block">Premio 2° Lugar</label>
                                <input className="w-full bg-black border border-gray-400/30 p-2.5 text-white rounded-lg text-sm focus:border-gray-400 outline-none" placeholder="$50 USD" value={selectedTournament.prize_2 || ""} onChange={e => handleChange("prize_2", e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[10px] text-orange-500 uppercase font-black tracking-wider mb-1 block">Premio 3° Lugar</label>
                                <input className="w-full bg-black border border-orange-500/30 p-2.5 text-white rounded-lg text-sm focus:border-orange-500 outline-none" placeholder="$25 USD" value={selectedTournament.prize_3 || ""} onChange={e => handleChange("prize_3", e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta del Bracket */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-lg font-black mb-6 text-white flex items-center gap-2 uppercase">
                            <Trophy className="text-sk-accent" size={20}/> Constructor de Bracket
                        </h3>
                        <div className="space-y-6 overflow-x-auto pb-4">
                            <div className="flex gap-6 min-w-max">
                                {selectedTournament.bracket_data.rounds.map((round: any, rIndex: number) => (
                                    <div key={rIndex} className="bg-black/40 p-4 rounded-xl border border-white/5 w-72 flex-shrink-0">
                                        <h4 className="text-sk-accent font-black uppercase text-xs mb-4 text-center">{round.name}</h4>
                                        <div className="flex flex-col gap-4">
                                            {round.matches.map((match: any, mIndex: number) => (
                                                <div key={mIndex} className="flex flex-col gap-1.5 p-3 bg-[#1a1a1a] rounded-lg border border-white/10 hover:border-white/30 transition-colors">
                                                    <div className="flex gap-2 items-center">
                                                        <input placeholder="TBD" className="bg-black border border-white/10 p-1.5 text-xs font-bold text-white flex-grow rounded focus:outline-none focus:border-sk-accent" value={match.p1} onChange={(e) => updateMatch(rIndex, mIndex, 'p1', e.target.value)} />
                                                        <input type="number" className="bg-black border border-white/10 p-1.5 text-xs font-bold text-white w-12 text-center rounded focus:outline-none focus:border-sk-accent" value={match.s1} onChange={(e) => updateMatch(rIndex, mIndex, 's1', Number(e.target.value))} />
                                                    </div>
                                                    <div className="flex gap-2 items-center">
                                                        <input placeholder="TBD" className="bg-black border border-white/10 p-1.5 text-xs font-bold text-white flex-grow rounded focus:outline-none focus:border-sk-accent" value={match.p2} onChange={(e) => updateMatch(rIndex, mIndex, 'p2', e.target.value)} />
                                                        <input type="number" className="bg-black border border-white/10 p-1.5 text-xs font-bold text-white w-12 text-center rounded focus:outline-none focus:border-sk-accent" value={match.s2} onChange={(e) => updateMatch(rIndex, mIndex, 's2', Number(e.target.value))} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="h-full bg-[#111] border border-white/10 rounded-2xl min-h-[400px] flex flex-col items-center justify-center text-gray-500 font-bold">
                    <Settings size={48} className="mb-4 opacity-20" />
                    <p>Selecciona un torneo a la izquierda para configurar sus detalles.</p>
                </div>
            )}
         </div>
      </div>
    </div>
  );
}