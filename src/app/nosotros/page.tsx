"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Trophy } from "lucide-react"; // Icono para trofeos

// SECCIONES DEL MENÚ
const SECTIONS = [
  { id: "historia", label: "Nuestra Historia" },
  { id: "somos", label: "Quiénes Somos" },
  { id: "igualdad", label: "Igualdad" },
  { id: "brand", label: "Kit de Marca" },
  { id: "staff", label: "Staff" },
];

function AboutContent() {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState("historia");

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  return (
    <div className="pt-24 bg-[#050505] min-h-screen flex flex-col md:flex-row">
      
      {/* MENÚ LATERAL */}
      <aside className="w-full md:w-1/4 p-8 md:sticky md:h-full overflow-y-auto border-r border-white/10 z-20 bg-[#050505]">
        <h2 className="text-3xl font-black uppercase italic mb-8 text-sk-accent">Acerca De</h2>
        <nav className="flex flex-col gap-2">
          {SECTIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`text-left py-3 px-4 uppercase font-bold tracking-wider transition-all border-l-2 ${
                activeSection === item.id 
                ? "border-sk-accent text-white bg-white/5 pl-6" 
                : "border-transparent text-gray-500 hover:text-gray-300 hover:pl-6"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="w-full md:w-3/4 p-8 md:p-16">
        
        {/* --- HISTORIA --- */}
        {activeSection === "historia" && (
          <div className="animate-fade-in space-y-8 max-w-4xl">
            <div>
              <h1 className="text-5xl font-black uppercase italic mb-4 text-white">El Origen</h1>
              <p className="text-xl text-sk-accent font-bold mb-4">
                "No formar parte de lo común."
              </p>
              <div className="text-gray-200 space-y-4 leading-relaxed text-lg font-light">
                <p>
                  Disp7aceD fue fundado en el año <strong>2010</strong> por dos hermanos y dos amigos, unidos por una misma pasión: <strong>Counter-Strike 1.6</strong>. En sus inicios, el proyecto nació como una pequeña comunidad enfocada en el juego competitivo de la época.
                </p>
                <p>
                  Con el tiempo, uno de los hermanos impulsó una visión más ambiciosa, orientada a llevar a Disp7aceD hacia un camino competitivo real, estructurando la comunidad en divisiones serias.
                </p>
              </div>
            </div>

            {/* SECCIÓN DE PALMARÉS (NUEVO) */}
            <div className="bg-[#111] border border-white/10 p-6 rounded-lg my-8">
               <h3 className="text-xl font-black uppercase italic text-white mb-6 flex items-center gap-2">
                 <Trophy className="text-sk-accent" /> Historial Campeonatos
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {/* Placeholder de Trofeos - Puedes duplicar esto */}
                  <div className="p-4 bg-black/50 rounded border border-white/5 hover:border-sk-accent transition-colors">
                     <span className="block text-2xl font-black text-white">2010</span>
                     <span className="text-xs text-gray-400 uppercase">Campeón Regional CS 1.6</span>
                  </div>
                  <div className="p-4 bg-black/50 rounded border border-white/5 hover:border-sk-accent transition-colors">
                     <span className="block text-2xl font-black text-white">2011</span>
                     <span className="text-xs text-gray-400 uppercase">Liga Nacional Femenina</span>
                  </div>
                  <div className="flex items-center justify-center opacity-30">
                     <span className="text-xs uppercase">Espacio para más títulos</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-8">
               <div>
                  <h3 className="text-2xl font-black text-white uppercase italic mb-2">La Pausa <span className="text-gray-500 text-base not-italic">(2011)</span></h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    A pesar de los logros en torneos LAN y online, en 2011 cerramos nuestras puertas. La salida de uno de los hermanos del mundo gaming y las responsabilidades personales impidieron continuar.
                  </p>
               </div>
               <div>
                  <h3 className="text-2xl font-black text-sk-accent uppercase italic mb-2">El Renacer <span className="text-white/50 text-base not-italic">(2026)</span></h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Tras más de una década, decidimos reactivar Disp7aceD. Esta nueva etapa nace con un enfoque maduro: construir una network sólida bajo valores de disciplina y compromiso.
                  </p>
               </div>
            </div>
          </div>
        )}

        {/* --- QUIENES SOMOS --- */}
        {activeSection === "somos" && (
          <div className="animate-fade-in space-y-8 max-w-4xl">
            <div>
               <h1 className="text-5xl font-black uppercase italic mb-6 text-white">Identidad <span className="text-sk-accent">Elite</span></h1>
               <div className="bg-[#111] border-l-4 border-sk-accent p-6 mb-8">
                  <p className="text-lg text-white italic leading-relaxed">
                    "El término <strong>Displaced</strong> hace referencia a estar fuera del sistema establecido. Representa una identidad que no sigue caminos predefinidos."
                  </p>
               </div>
               <p className="text-gray-200 leading-relaxed mb-4 text-lg">
                 Este concepto se inspira en la visión de las <strong>unidades de élite</strong>. No se trata solo de estar separados, sino de elevar el estándar.
               </p>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h2 className="text-3xl font-black uppercase italic mb-4 text-white">La Organización</h2>
              <p className="text-gray-200 leading-relaxed mb-4">
                Disp7aceD Network es una organización de gaming y esports enfocada en la formación, desarrollo y proyección de equipos competitivos y creadores de contenido.
              </p>
              <p className="text-gray-200 text-sm"> {/* Cambiado a blanco */}
                Operamos bajo una estructura profesional orientada al rendimiento. Entendemos el gaming como una disciplina que exige constancia, respeto y trabajo en equipo.
              </p>
            </div>
          </div>
        )}

        {/* --- IGUALDAD --- */}
        {activeSection === "igualdad" && (
          <div className="animate-fade-in space-y-6 max-w-4xl">
            <h1 className="text-5xl font-black uppercase italic mb-8 text-white">
              Talento <span className="text-sk-accent">Sin Género</span>
            </h1>
            <Image src="/fondo.jpg" alt="Igualdad" width={800} height={300} className="w-full h-64 object-cover rounded-lg mb-6 opacity-60 hover:opacity-100 transition-all duration-500" />
            
            <p className="text-xl text-white font-bold">
              El talento, la disciplina y la competitividad no dependen del género, la identidad ni el origen.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div>
                <h3 className="text-sk-accent font-bold uppercase text-sm mb-2">Nuestra Historia</h3>
                <p className="text-gray-200 text-sm leading-relaxed"> {/* Texto blanco */}
                  Desde nuestros primeros años, Disp7aceD promovió un entorno inclusivo. Esta visión se consolidó con la creación histórica de nuestra <strong>división femenina</strong>.
                </p>
              </div>
              <div>
                <h3 className="text-sk-accent font-bold uppercase text-sm mb-2">Compromiso Actual</h3>
                <p className="text-gray-200 text-sm leading-relaxed"> {/* Texto blanco */}
                  Hoy reafirmamos ese compromiso: desarrollar oportunidades reales para jugadoras y creadoras bajo los mismos estándares de exigencia.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- KIT DE MARCA --- */}
        {activeSection === "brand" && (
          <div className="animate-fade-in max-w-4xl">
            <h1 className="text-5xl font-black uppercase italic mb-4 text-white">
              Media <span className="text-sk-accent">Kit</span>
            </h1>
            <p className="text-gray-200 mb-8">
              Descarga nuestros logotipos oficiales y wallpapers para personalizar tu setup.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-[#111] rounded-xl flex flex-col items-center justify-center border border-white/10 hover:border-sk-accent cursor-pointer transition-all group relative overflow-hidden">
                    <span className="z-10 font-bold uppercase text-xl text-white mb-2">Wallpapers PC</span>
                    <span className="z-10 text-xs text-sk-accent uppercase tracking-widest">4K & Ultrawide</span>
                    <Image src="/fondo.jpg" fill className="object-cover opacity-30 group-hover:opacity-60 transition-opacity duration-500" alt="wp" />
                </div>
                 <div className="h-64 bg-[#111] rounded-xl flex flex-col items-center justify-center border border-white/10 hover:border-white cursor-pointer transition-all group relative overflow-hidden">
                    <span className="z-10 font-bold uppercase text-xl text-white mb-2">Logotipos</span>
                    <span className="z-10 text-xs text-gray-400 uppercase tracking-widest">Vector & PNG</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                </div>
            </div>
          </div>
        )}

        {/* --- STAFF --- */}
        {activeSection === "staff" && (
          <div className="animate-fade-in max-w-4xl">
            <h1 className="text-5xl font-black uppercase italic mb-8 text-white">
              Staff <span className="text-sk-accent">Oficial</span>
            </h1>
            <p className="text-gray-200 mb-8">
              El equipo detrás de la operación de Disp7aceD Network.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {['CEO & Fundador', 'Manager Deportivo', 'Head de Contenido', 'Community Manager'].map((role, i) => (
                  <div key={i} className="bg-[#111] p-8 border border-white/10 hover:border-sk-accent transition-colors group">
                      <h3 className="text-2xl font-black italic text-white group-hover:text-sk-accent transition-colors">{role}</h3>
                      <p className="text-gray-400 text-sm mt-2 group-hover:text-white transition-colors">Disp7aceD Network</p>
                  </div>
                ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">Cargando...</div>}>
      <AboutContent />
    </Suspense>
  );
}