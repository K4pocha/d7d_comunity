"use client";

interface Match {
  p1: string; // Player/Team 1
  p2: string; // Player/Team 2
  s1: number; // Score 1
  s2: number; // Score 2
  winner?: number; // 1 o 2 (opcional para colorear)
}

interface Round {
  name: string;
  matches: Match[];
}

export default function TournamentBracket({ data }: { data: { rounds: Round[] } }) {
  if (!data || !data.rounds) return <div className="text-gray-500">Bracket no disponible</div>;

  return (
    <div className="flex justify-between items-center overflow-x-auto gap-8 py-10 px-4">
      {data.rounds.map((round, rIndex) => (
        <div key={rIndex} className="flex flex-col justify-around flex-1 min-w-[200px] h-full gap-8">
          <h3 className="text-center text-sk-accent font-bold uppercase text-sm mb-4 tracking-widest border-b border-sk-accent/20 pb-2">
            {round.name}
          </h3>
          
          <div className="flex flex-col justify-around h-full gap-8">
            {round.matches.map((match, mIndex) => {
               // Lógica para determinar color del ganador
               const p1Win = match.s1 > match.s2;
               const p2Win = match.s2 > match.s1;
               
               return (
                <div key={mIndex} className="relative flex flex-col bg-[#111] border border-white/10 rounded-lg overflow-hidden w-full group hover:border-sk-accent transition-colors">
                  {/* Equipo 1 */}
                  <div className={`flex justify-between items-center px-4 py-2 border-b border-white/5 ${p1Win ? 'bg-sk-accent/10 text-white' : 'text-gray-400'}`}>
                    <span className="font-bold truncate text-sm">{match.p1}</span>
                    <span className="font-mono bg-black/50 px-2 rounded text-xs">{match.s1}</span>
                  </div>
                  
                  {/* Equipo 2 */}
                  <div className={`flex justify-between items-center px-4 py-2 ${p2Win ? 'bg-sk-accent/10 text-white' : 'text-gray-400'}`}>
                    <span className="font-bold truncate text-sm">{match.p2}</span>
                    <span className="font-mono bg-black/50 px-2 rounded text-xs">{match.s2}</span>
                  </div>

                  {/* Conectores visuales (Líneas) - Solo si no es la última ronda */}
                  {rIndex < data.rounds.length - 1 && (
                    <div className="absolute top-1/2 -right-4 w-4 h-[1px] bg-white/20 hidden md:block"></div>
                  )}
                </div>
               );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}