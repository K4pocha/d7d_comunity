"use client";
import { useState, useEffect } from "react";
import { Plus, Save, Trash2, Edit } from "lucide-react";

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
    await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, game: newGame, start_date: new Date() })
    });
    setNewTitle("");
    loadTournaments();
  };

  const handleUpdateBracket = async () => {
    if (!selectedTournament) return;
    await fetch('/api/tournaments', {
        method: 'PUT',
        body: JSON.stringify({ 
            id: selectedTournament.id, 
            bracket_data: selectedTournament.bracket_data,
            status: selectedTournament.status 
        })
    });
    alert("Bracket Actualizado!");
    loadTournaments();
  };

  // Función para editar una partida específica en memoria
  const updateMatch = (rIndex: number, mIndex: number, field: string, value: any) => {
     const newData = { ...selectedTournament };
     newData.bracket_data.rounds[rIndex].matches[mIndex][field] = value;
     setSelectedTournament(newData);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-40 px-4 md:px-10">
      <h1 className="text-4xl font-black uppercase text-sk-accent mb-8">Gestión de Torneos</h1>

      {/* CREAR NUEVO */}
      <div className="bg-[#111] p-6 rounded-xl border border-white/10 mb-8 flex gap-4 items-end">
         <div className="flex-grow">
            <label className="text-xs text-gray-500 uppercase font-bold">Nombre Torneo</label>
            <input className="w-full bg-black border border-white/20 p-2 text-white rounded" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
         </div>
         <div className="w-48">
            <label className="text-xs text-gray-500 uppercase font-bold">Juego</label>
            <select className="w-full bg-black border border-white/20 p-2 text-white rounded" value={newGame} onChange={e => setNewGame(e.target.value)}>
                <option>Valorant</option><option>CS2</option><option>League of Legends</option>
            </select>
         </div>
         <button onClick={handleCreate} className="bg-sk-accent text-black font-bold px-4 py-2 rounded flex gap-2"><Plus/> Crear</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* LISTA IZQUIERDA */}
         <div className="space-y-2">
            {tournaments.map(t => (
                <div key={t.id} onClick={() => {
                    // Parsear bracket al seleccionar
                    const parsed = typeof t.bracket_data === 'string' ? JSON.parse(t.bracket_data) : t.bracket_data;
                    setSelectedTournament({...t, bracket_data: parsed});
                }} className={`p-4 border rounded cursor-pointer hover:bg-white/5 ${selectedTournament?.id === t.id ? 'border-sk-accent bg-sk-accent/10' : 'border-white/10 bg-[#111]'}`}>
                    <h3 className="font-bold">{t.title}</h3>
                    <p className="text-xs text-gray-500">{t.game} - {t.status}</p>
                </div>
            ))}
         </div>

         {/* EDITOR DERECHA */}
         <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-xl p-6">
            {selectedTournament ? (
                <div>
                    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                        <h2 className="text-xl font-bold">Editando: {selectedTournament.title}</h2>
                        <div className="flex gap-2">
                            <select 
                                value={selectedTournament.status} 
                                onChange={(e) => setSelectedTournament({...selectedTournament, status: e.target.value})}
                                className="bg-black border border-white/20 rounded p-2 text-xs"
                            >
                                <option>Inscripciones</option><option>En Curso</option><option>Finalizado</option>
                            </select>
                            <button onClick={handleUpdateBracket} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold flex gap-2 text-xs items-center"><Save size={14}/> Guardar Cambios</button>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {selectedTournament.bracket_data.rounds.map((round: any, rIndex: number) => (
                            <div key={rIndex} className="bg-black/40 p-4 rounded border border-white/5">
                                <h4 className="text-sk-accent font-bold uppercase text-xs mb-3">{round.name}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {round.matches.map((match: any, mIndex: number) => (
                                        <div key={mIndex} className="flex flex-col gap-2 p-3 bg-[#1a1a1a] rounded border border-white/10">
                                            <div className="flex gap-2">
                                                <input placeholder="Equipo 1" className="bg-black border border-white/10 p-1 text-xs text-white flex-grow rounded" value={match.p1} onChange={(e) => updateMatch(rIndex, mIndex, 'p1', e.target.value)} />
                                                <input type="number" className="bg-black border border-white/10 p-1 text-xs text-white w-12 text-center rounded" value={match.s1} onChange={(e) => updateMatch(rIndex, mIndex, 's1', Number(e.target.value))} />
                                            </div>
                                            <div className="flex gap-2">
                                                <input placeholder="Equipo 2" className="bg-black border border-white/10 p-1 text-xs text-white flex-grow rounded" value={match.p2} onChange={(e) => updateMatch(rIndex, mIndex, 'p2', e.target.value)} />
                                                <input type="number" className="bg-black border border-white/10 p-1 text-xs text-white w-12 text-center rounded" value={match.s2} onChange={(e) => updateMatch(rIndex, mIndex, 's2', Number(e.target.value))} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-500">Selecciona un torneo para editar el bracket</div>
            )}
         </div>
      </div>
    </div>
  );
}