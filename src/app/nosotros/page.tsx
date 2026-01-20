"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Trophy } from "lucide-react";

const SECTIONS = [
  { id: "historia", label: "Nuestra Historia" },
  { id: "somos", label: "Quiénes Somos" },
  { id: "igualdad", label: "Igualdad" },
  { id: "brand", label: "Kit de Marca" },
  { id: "staff", label: "Staff" },
];

// DATOS REALES DEL STAFF
const STAFF_DATA = [
  { name: "Cristian A. Calixto", role: "Fundador y Director General", image: "/staff/cristian.jpg" },
  { name: "Luigi S. Constanzi", role: "Co-Fundador", image: "/staff/luigi.jpg" },
  { name: "Catalina A. Galleguillos", role: "Gerente de Redes Sociales", image: "/staff/catalina.jpg" },
  { name: "Nicolas Oñate", role: "Desarrollador", image: "/staff/nico.jpg" },
  { name: "Jordan T. Olivares", role: "Manager de Equipo Competitivo", image: "/staff/jordan.jpg" },
];

function AboutContent() {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState("historia");

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) setActiveSection(section);
  }, [searchParams]);

  return (
    <div className="pt-24 bg-[#050505] min-h-screen flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-1/4 p-8 md:sticky md:h-full overflow-y-auto border-r border-white/10 z-20 bg-[#050505]">
        <h2 className="text-3xl font-black uppercase italic mb-8 text-sk-accent">Acerca De</h2>
        <nav className="flex flex-col gap-2">
          {SECTIONS.map((item) => (
            <button key={item.id} onClick={() => setActiveSection(item.id)} className={`text-left py-3 px-4 uppercase font-bold tracking-wider transition-all border-l-2 ${activeSection === item.id ? "border-sk-accent text-white bg-white/5 pl-6" : "border-transparent text-gray-500 hover:text-gray-300 hover:pl-6"}`}>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="w-full md:w-3/4 p-8 md:p-16">
        
        {/* --- HISTORIA --- */}
        {activeSection === "historia" && (
          <div className="animate-fade-in space-y-8 max-w-4xl">
            <h1 className="text-5xl font-black uppercase italic mb-4 text-white">El Origen</h1>
            <p className="text-gray-200 text-lg leading-relaxed">Disp7aceD fue fundado en el año <strong>2010</strong>...</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-8">
               <div><h3 className="text-2xl font-black text-white uppercase italic mb-2">La Pausa</h3><p className="text-gray-200">En 2011 cerramos...</p></div>
               <div><h3 className="text-2xl font-black text-sk-accent uppercase italic mb-2">El Renacer</h3><p className="text-gray-200">En 2026 volvimos...</p></div>
            </div>
          </div>
        )}

        {/* --- QUIENES SOMOS (Con imagen intermedia) --- */}
        {activeSection === "somos" && (
          <div className="animate-fade-in space-y-8 max-w-4xl">
            <h1 className="text-5xl font-black uppercase italic mb-6 text-white">Identidad <span className="text-sk-accent">Elite</span></h1>
            <p className="text-gray-200 leading-relaxed text-lg">El término Displaced representa estar fuera del sistema...</p>
            
            {/* IMAGEN INTERMEDIA */}
            <div className="w-full h-64 md:h-96 relative my-12 rounded-xl overflow-hidden border border-white/10">
               <img src="/uploads/identidad.jpg" alt="Identidad" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src="/fondo.jpg"}/>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h2 className="text-3xl font-black uppercase italic mb-4 text-white">La Organización</h2>
              <p className="text-gray-200">Disp7aceD Network es una organización de gaming...</p>
            </div>
          </div>
        )}

        {/* --- IGUALDAD (Títulos arreglados + Imagen) --- */}
        {activeSection === "igualdad" && (
          <div className="animate-fade-in space-y-6 max-w-4xl">
            <h1 className="text-5xl font-black uppercase italic mb-8 text-white">Talento <span className="text-sk-accent">Sin Género</span></h1>
            
            {/* IMAGEN MUJERES GAMING */}
            <div className="w-full h-64 md:h-96 relative my-8 rounded-xl overflow-hidden border border-sk-accent/30 shadow-[0_0_30px_rgba(255,0,255,0.1)]">
                 <img src="/uploads/mujeres-gaming.jpg" alt="Igualdad" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src="/fondo.jpg"}/>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div>
                {/* TÍTULOS CON ESTILO UNIFICADO */}
                <h3 className="text-2xl font-black text-white uppercase italic mb-2">Nuestra Historia</h3>
                <p className="text-gray-200">Desde nuestros primeros años...</p>
              </div>
              <div>
                <h3 className="text-2xl font-black text-sk-accent uppercase italic mb-2">Compromiso Actual</h3>
                <p className="text-gray-200">Hoy reafirmamos ese compromiso...</p>
              </div>
            </div>
          </div>
        )}

        {/* --- BRAND --- */}
        {activeSection === "brand" && ( <div className="animate-fade-in"><h1 className="text-5xl font-black text-white uppercase italic">Media Kit</h1><p className="text-gray-200 mt-4">Próximamente descargas...</p></div> )}

        {/* --- STAFF (Integrado) --- */}
        {activeSection === "staff" && (
          <div className="animate-fade-in max-w-6xl">
            <h1 className="text-5xl font-black uppercase italic mb-8 text-white">Staff <span className="text-sk-accent">Oficial</span></h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STAFF_DATA.map((member, index) => (
                  <div key={index} className="bg-[#111] border border-white/10 rounded-xl overflow-hidden hover:border-sk-accent transition-all group">
                    <div className="h-80 w-full relative bg-gray-800">
                       <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" onError={(e) => e.currentTarget.src = "/placeholder-user.jpg"} />
                    </div>
                    <div className="p-6">
                       <h3 className="text-xl font-black text-white uppercase italic leading-none mb-2">{member.name}</h3>
                       <p className="text-xs text-sk-accent font-bold tracking-widest uppercase">{member.role}</p>
                    </div>
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
  return <Suspense fallback={<div>Cargando...</div>}><AboutContent /></Suspense>;
}