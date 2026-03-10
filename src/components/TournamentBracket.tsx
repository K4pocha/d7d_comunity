"use client";

interface Match {
  p1: string;
  p2: string;
  s1: number;
  s2: number;
}

interface Round {
  name: string;
  matches: Match[];
}

export default function TournamentBracket({ data }: { data: { rounds: Round[] } }) {
  if (!data || !data.rounds) return <div className="text-gray-500 text-center py-10">Bracket no disponible</div>;

  return (
    <div className="flex justify-start md:justify-center items-center overflow-x-auto gap-8 py-10 px-4 min-h-[400px] custom-scrollbar">
      {data.rounds.map((round, rIndex) => (
        <div key={rIndex} className="flex flex-col justify-around flex-none w-[260px] h-full gap-8 relative">
          <h3 className="text-center text-sk-accent font-bold uppercase text-sm mb-6 tracking-widest border-b border-sk-accent/20 pb-2">
            {round.name}
          </h3>
          
          <div className="flex flex-col justify-around h-full gap-6 flex-grow">
            {round.matches.map((match, mIndex) => {
               // Determinar ganadores
               const p1Win = match.s1 > match.s2;
               const p2Win = match.s2 > match.s1;
               const isTbd = match.p1 === "TBD" && match.p2 === "TBD";
               
               return (
                <div key={mIndex} className="relative flex flex-col bg-[#111] border border-white/10 rounded-lg overflow-hidden w-full group hover:border-sk-accent/50 transition-colors shadow-lg">
                  {/* Equipo 1 */}
                  <div className={`flex justify-between items-center px-4 py-3 border-b border-white/5 ${p1Win ? 'bg-sk-accent/20 text-white' : isTbd ? 'text-gray-600' : 'text-gray-300'}`}>
                    <span className={`font-bold truncate text-sm ${p1Win && 'text-sk-accent'}`}>{match.p1}</span>
                    <span className="font-mono bg-black/60 px-2 py-0.5 rounded text-xs border border-white/5">{match.s1}</span>
                  </div>
                  
                  {/* Equipo 2 */}
                  <div className={`flex justify-between items-center px-4 py-3 ${p2Win ? 'bg-sk-accent/20 text-white' : isTbd ? 'text-gray-600' : 'text-gray-300'}`}>
                    <span className={`font-bold truncate text-sm ${p2Win && 'text-sk-accent'}`}>{match.p2}</span>
                    <span className="font-mono bg-black/60 px-2 py-0.5 rounded text-xs border border-white/5">{match.s2}</span>
                  </div>

                  {/* Conectores visuales (Líneas) */}
                  {rIndex < data.rounds.length - 1 && (
                    <>
                      {/* Línea horizontal saliendo del match */}
                      <div className="absolute top-1/2 -right-4 w-4 h-[2px] bg-white/10 hidden md:block group-hover:bg-sk-accent/50 transition-colors"></div>
                      {/* Línea vertical conectando matches (se renderiza solo en matches pares) */}
                      {mIndex % 2 === 0 && (
                        <div className="absolute top-1/2 -right-4 w-[2px] bg-white/10 hidden md:block" style={{ height: 'calc(100% + 1.5rem + 2px)' }}></div>
                      )}
                    </>
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