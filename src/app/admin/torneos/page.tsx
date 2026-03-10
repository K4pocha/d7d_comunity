"use client";
import { useState, useEffect } from "react";
import { Plus, Save } from "lucide-react";

export default function AdminTournaments() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  
  // Estados para crear nuevo torneo
  const [newTitle, setNewTitle] = useState("");
  const [newGame, setNewGame] = useState("Valorant");
  const [newDate, setNewDate] = useState(""); 
  const [newFormat, setNewFormat] = useState("BO1");
  const [newMaxSlots, setNewMaxSlots] = useState<number | string>(16);
  const [newSponsor, setNewSponsor] = useState("");

  useEffect(() => { loadTournaments(); }, []);

  const loadTournaments = () => {
    fetch('/api/tournaments').then(r => r.json()).then(setTournaments);
  };

  const handleCreate = async () => {
    if (!newTitle || !newDate) {
        alert("Por favor, ingresa un nombre y una fecha.");
        return;
    }

    await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            title: newTitle, 
            game: newGame, 
            start_date: newDate,
            format: newFormat,
            max_slots: Number(newMaxSlots),
            sponsor: newSponsor
        })
    });
    
    // Resetear formulario
    setNewTitle("");
    setNewDate("");
    setNewFormat("BO1");
    setNewMaxSlots(16);
    setNewSponsor("");
    loadTournaments();
  };

  const handleUpdateBracket = async () => {
    if (!selectedTournament) return;
    await fetch('/api/tournaments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            id: selectedTournament.id, 
            bracket_data: selectedTournament.bracket_data,
            status: selectedTournament.status 
        })
    });
    alert("¡Torneo Actualizado!");
    loadTournaments();
  };

  const updateMatch = (rIndex: number, mIndex: number, field: string, value: any) => {
     setSelectedTournament((prev: any) => {
         const newData = JSON.parse(JSON.stringify(prev));
         newData.bracket_data.rounds[rIndex].matches[mIndex][field] = value;
         return newData;
     });
  };

  return (
    <div className="min-h-screen bg-black text-white pt-40 px-4 md:px-10 pb-20">
      <h1 className="text-4xl font-black uppercase text-sk-accent mb-8">Gestión de Torneos</h1>

      {/* CREAR NUEVO */}
      <div className="bg-[#111] p-6 rounded-xl border border-white/10 mb-8 space-y-4">
         <h2 className="text-lg font-bold uppercase text-sk-accent border-b border-white/10 pb-2">Crear Nuevo Torneo</h2>
         
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="md:col-span-2">
              <label className="text-xs text-gray-500 uppercase font-bold">Nombre Torneo</label>
              <input className="w-full bg-black border border-white/20 p-2 text-white rounded focus:border-sk-accent outline-none" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Ej: Liga de Verano" />
           </div>
           <div>
              <label className="text-xs text-gray-500 uppercase font-bold">Juego</label>
              <select className="w-full bg-black border border-white/20 p-2 text-white rounded outline-none" value={newGame} onChange={e => setNewGame(e.target.value)}>
                  <option value="Valorant">Valorant</option>
                  <option value="CS2">CS2</option>
                  <option value="League of Legends">League of Legends</option>
                  <option value="Rocket League">Rocket League</option>
                  <option value="Delta Force">Delta Force</option>
              </select>
           </div>
           <div>
              <label className="text-xs text-gray-500 uppercase font-bold">Fecha de Inicio</label>
              <input type="date" className="w-full bg-black border border-white/20 p-2 text-white rounded outline-none" value={newDate} onChange={e => setNewDate(e.target.value)} />
           </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div>
              <label className="text-xs text-gray-500 uppercase font-bold">Formato</label>
              <select className="w-full bg-black border border-white/20 p-2 text-white rounded outline-none" value={newFormat} onChange={e => setNewFormat(e.target.value)}>
                  <option value="BO1">BO1</option>
                  <option value="BO3">BO3</option>
                  <option value="BO5">BO5</option>
              </select>
           </div>
           <div>
              <label className="text-xs text-gray-500 uppercase font-bold">Cupos Máximos</label>
              <input type="number" className="w-full bg-black border border-white/20 p-2 text-white rounded outline-none" value={newMaxSlots} onChange={e => setNewMaxSlots(e.target.value)} placeholder="Ej: 16" />
           </div>
           <div>
              <label className="text-xs text-gray-500 uppercase font-bold">Sponsor</label>
              <input className="w-full bg-black border border-white/20 p-2 text-white rounded outline-none" value={newSponsor} onChange={e => setNewSponsor(e.target.value)} placeholder="Ej: Logitech" />
           </div>
           <div className="flex items-end">
             <button onClick={handleCreate} className="w-full bg-sk-accent text-black font-bold px-6 py-2 rounded flex justify-center gap-2 hover:bg-white transition-colors"><Plus/> Crear Torneo</button>
           </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* LISTA IZQUIERDA */}
         <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {tournaments.map(t => (
                <div key={t.id} onClick={() => {
                    const parsed = typeof t.bracket_data === 'string' ? JSON.parse(t.bracket_data) : t.bracket_data;
                    setSelectedTournament({...t, bracket_data: parsed});
                }} className={`p-4 border rounded cursor-pointer transition-colors ${selectedTournament?.id === t.id ? 'border-sk-accent bg-sk-accent/10' : 'border-white/10 bg-[#111] hover:border-white/30'}`}>
                    <h3 className="font-bold truncate">{t.title}</h3>
                    <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-400 bg-black px-2 py-1 rounded">{t.game}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${t.status === 'En Curso' ? 'text-green-400' : 'text-sk-accent'}`}>{t.status}</span>
                    </div>
                </div>
            ))}
         </div>

         {/* EDITOR DERECHA */}
         <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-xl p-6 overflow-x-auto">
            {selectedTournament ? (
                <div className="min-w-[600px]">
                    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                        <h2 className="text-xl font-bold">Editando: <span className="text-sk-accent">{selectedTournament.title}</span></h2>
                        <div className="flex gap-4">
                            <select 
                                value={selectedTournament.status} 
                                onChange={(e) => setSelectedTournament({...selectedTournament, status: e.target.value})}
                                className="bg-black border border-white/20 rounded p-2 text-sm font-bold uppercase outline-none"
                            >
                                <option>Inscripciones</option><option>En Curso</option><option>Finalizado</option>
                            </select>
                            <button onClick={handleUpdateBracket} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold flex gap-2 text-sm items-center transition-colors"><Save size={16}/> Guardar Bracket</button>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-between">
                        {selectedTournament.bracket_data.rounds.map((round: any, rIndex: number) => (
                            <div key={rIndex} className="flex-1 bg-black/40 p-4 rounded border border-white/5 space-y-4">
                                <h4 className="text-sk-accent font-bold uppercase text-xs text-center border-b border-white/10 pb-2">{round.name}</h4>
                                <div className="flex flex-col gap-6 justify-center h-full">
                                    {round.matches.map((match: any, mIndex: number) => (
                                        <div key={mIndex} className="flex flex-col gap-2 p-3 bg-[#1a1a1a] rounded border border-white/10 focus-within:border-sk-accent transition-colors">
                                            <div className="flex gap-2">
                                                <input placeholder="Equipo 1" className="bg-black border border-white/10 p-1.5 text-xs text-white flex-grow rounded outline-none" value={match.p1} onChange={(e) => updateMatch(rIndex, mIndex, 'p1', e.target.value)} />
                                                <input type="number" className="bg-black border border-white/10 p-1.5 text-xs text-white w-14 text-center rounded outline-none" value={match.s1} onChange={(e) => updateMatch(rIndex, mIndex, 's1', Number(e.target.value))} />
                                            </div>
                                            <div className="flex gap-2">
                                                <input placeholder="Equipo 2" className="bg-black border border-white/10 p-1.5 text-xs text-white flex-grow rounded outline-none" value={match.p2} onChange={(e) => updateMatch(rIndex, mIndex, 'p2', e.target.value)} />
                                                <input type="number" className="bg-black border border-white/10 p-1.5 text-xs text-white w-14 text-center rounded outline-none" value={match.s2} onChange={(e) => updateMatch(rIndex, mIndex, 's2', Number(e.target.value))} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-500 uppercase tracking-widest text-sm font-bold min-h-[400px]">Selecciona un torneo de la lista</div>
            )}
         </div>
      </div>
    </div>
  );
}