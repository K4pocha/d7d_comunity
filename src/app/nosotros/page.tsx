"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

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
      
      {/* 1. MENÚ LATERAL */}
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

      {/* 2. CONTENIDO */}
      <main className="w-full md:w-3/4 p-8 md:p-16">
        
        {/* --- HISTORIA --- */}
        {activeSection === "historia" && (
          <div className="animate-fade-in space-y-8 max-w-4xl">
            <div>
              <h1 className="text-5xl font-black uppercase italic mb-4">El Origen</h1>
              <p className="text-xl text-sk-accent font-bold mb-4">
                "No formar parte de lo común."
              </p>
              <div className="text-gray-300 space-y-4 leading-relaxed text-lg">
                <p>
                  Disp7aceD fue fundado en el año <strong>2010</strong> por dos hermanos y dos amigos, unidos por una misma pasión: <strong>Counter-Strike 1.6</strong>. En sus inicios, el proyecto nació como una pequeña comunidad enfocada en el juego competitivo de la época, el compañerismo y la creación de un espacio auténtico.
                </p>
                <p>
                  Con el tiempo, uno de los hermanos impulsó una visión más ambiciosa, orientada a llevar a Disp7aceD hacia un camino competitivo real. Esto marcó el inicio de una etapa de crecimiento y organización, estructurando la comunidad en divisiones serias y otras para veteranos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-8">
               <div>
                  <h3 className="text-2xl font-bold text-white mb-2">La Pausa (2011)</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    A pesar de los logros en torneos LAN y online, y el lanzamiento histórico de nuestra división femenina, en 2011 cerramos nuestras puertas. La salida de uno de los hermanos del mundo gaming y las responsabilidades personales impidieron continuar el proyecto al nivel aspirado.
                  </p>
               </div>
               <div>
                  <h3 className="text-2xl font-bold text-sk-accent mb-2">El Renacer (2026)</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Tras más de una década, uno de los fundadores decide reactivar Disp7aceD. Esta nueva etapa nace con un enfoque maduro: construir una network sólida, formar equipos profesionales y establecer una comunidad estructurada bajo valores de disciplina y compromiso.
                  </p>
               </div>
            </div>
            
            {/* Timeline Visual */}
            <div className="flex justify-between items-center mt-12 bg-white/5 p-6 rounded-lg">
                <div className="text-center">
                    <span className="block text-4xl font-black text-gray-600">2010</span>
                    <span className="text-xs uppercase text-gray-500 font-bold">Fundación</span>
                </div>
                <div className="h-px w-full bg-white/20 mx-4"></div>
                <div className="text-center">
                    <span className="block text-4xl font-black text-gray-600">2011</span>
                    <span className="text-xs uppercase text-gray-500 font-bold">Pausa</span>
                </div>
                <div className="h-px w-full bg-sk-accent mx-4"></div>
                 <div className="text-center">
                    <span className="block text-4xl font-black text-sk-accent">2026</span>
                    <span className="text-xs uppercase text-sk-accent font-bold">Rebirth</span>
                </div>
            </div>
          </div>
        )}

        {/* --- QUIENES SOMOS --- */}
        {activeSection === "somos" && (
          <div className="animate-fade-in space-y-8 max-w-4xl">
            
            {/* Significado del Nombre */}
            <div>
               <h1 className="text-5xl font-black uppercase italic mb-6">Identidad <span className="text-sk-accent">Elite</span></h1>
               <div className="bg-[#111] border-l-4 border-sk-accent p-6 mb-8">
                  <p className="text-lg text-white italic leading-relaxed">
                    "El término <strong>Displaced</strong> hace referencia a estar fuera del sistema establecido. Representa una identidad que no sigue caminos predefinidos, sino que busca destacar desde la diferencia."
                  </p>
               </div>
               <p className="text-gray-300 leading-relaxed mb-4">
                 Este concepto se inspira en la visión de las <strong>unidades de élite</strong>, aquellas reconocidas por operar fuera de los esquemas tradicionales, siendo seleccionadas entre los mejores y preparadas para rendir al más alto nivel. No se trata solo de estar separados, sino de elevar el estándar.
               </p>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h2 className="text-3xl font-black uppercase italic mb-4">La Organización</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Disp7aceD Network es una organización de gaming y esports enfocada en la formación, desarrollo y proyección de equipos competitivos y creadores de contenido.
              </p>
              <p className="text-gray-400 text-sm">
                Operamos bajo una estructura profesional orientada al rendimiento. Entendemos el gaming como una disciplina que exige constancia, respeto y trabajo en equipo, fomentando una cultura de responsabilidad y competitividad sana tanto dentro como fuera del juego.
              </p>
            </div>
          </div>
        )}

        {/* --- IGUALDAD --- */}
        {activeSection === "igualdad" && (
          <div className="animate-fade-in space-y-6 max-w-4xl">
            <h1 className="text-5xl font-black uppercase italic mb-8">Talento sin Género</h1>
            <Image src="/fondo.jpg" alt="Igualdad" width={800} height={300} className="w-full h-64 object-cover rounded-lg mb-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500" />
            
            <p className="text-xl text-white font-bold">
              El talento, la disciplina y la competitividad no dependen del género, la identidad ni el origen.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div>
                <h3 className="text-sk-accent font-bold uppercase text-sm mb-2">Nuestra Historia</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Desde nuestros primeros años, Disp7aceD promovió un entorno inclusivo. Esta visión se consolidó con la creación histórica de nuestra <strong>división femenina</strong>, que participó activamente en torneos y ligas de su época, marcando un paso importante en la diversidad competitiva.
                </p>
              </div>
              <div>
                <h3 className="text-sk-accent font-bold uppercase text-sm mb-2">Compromiso Actual</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Hoy reafirmamos ese compromiso: desarrollar oportunidades reales para jugadoras y creadoras. Nuestro objetivo es construir un entorno donde la diversidad sea parte natural del crecimiento, bajo los mismos estándares de exigencia y profesionalismo para todos.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- KIT DE MARCA --- */}
        {activeSection === "brand" && (
          <div className="animate-fade-in max-w-4xl">
            <h1 className="text-5xl font-black uppercase italic mb-4">Media Kit</h1>
            <p className="text-gray-400 mb-8">
              Descarga nuestros logotipos oficiales y wallpapers para personalizar tu setup con el estilo D7D.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-[#111] rounded-xl flex flex-col items-center justify-center border border-white/10 hover:border-sk-accent cursor-pointer transition-all group relative overflow-hidden">
                    <span className="z-10 font-bold uppercase text-xl mb-2">Wallpapers PC</span>
                    <span className="z-10 text-xs text-sk-accent uppercase tracking-widest">4K & Ultrawide</span>
                    <Image src="/fondo.jpg" fill className="object-cover opacity-20 group-hover:opacity-50 transition-opacity duration-500" alt="wp" />
                </div>
                 <div className="h-64 bg-[#111] rounded-xl flex flex-col items-center justify-center border border-white/10 hover:border-white cursor-pointer transition-all group relative overflow-hidden">
                    <span className="z-10 font-bold uppercase text-xl mb-2">Logotipos</span>
                    <span className="z-10 text-xs text-gray-400 uppercase tracking-widest">Vector & PNG</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                </div>
            </div>
          </div>
        )}

        {/* --- STAFF --- */}
        {activeSection === "staff" && (
          <div className="animate-fade-in max-w-4xl">
            <h1 className="text-5xl font-black uppercase italic mb-8">Staff Oficial</h1>
            <p className="text-gray-400 mb-8">
              El equipo detrás de la operación de Disp7aceD Network.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[#111] p-8 border border-white/10 hover:border-sk-accent transition-colors group">
                    <h3 className="text-2xl font-black italic text-white group-hover:text-sk-accent transition-colors">CEO & Fundador</h3>
                    <p className="text-gray-500 text-sm mt-2">Dirección General & Visión</p>
                </div>
                <div className="bg-[#111] p-8 border border-white/10 hover:border-sk-accent transition-colors group">
                    <h3 className="text-2xl font-black italic text-white group-hover:text-sk-accent transition-colors">Manager Deportivo</h3>
                    <p className="text-gray-500 text-sm mt-2">Operaciones de Equipos & Torneos</p>
                </div>
                 <div className="bg-[#111] p-8 border border-white/10 hover:border-sk-accent transition-colors group">
                    <h3 className="text-2xl font-black italic text-white group-hover:text-sk-accent transition-colors">Head de Contenido</h3>
                    <p className="text-gray-500 text-sm mt-2">Redes Sociales & Producción</p>
                </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#050505]">Cargando...</div>}>
      <AboutContent />
    </Suspense>
  );
}