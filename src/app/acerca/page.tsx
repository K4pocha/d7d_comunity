import { Users, Target, Mail, Trophy } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-20 pb-20 min-h-screen bg-sk-black text-white">
      
      {/* 1. HEADER / NUESTRA HISTORIA */}
      <section className="max-w-7xl mx-auto px-4 mb-20 text-center">
        <h1 className="text-6xl md:text-8xl font-black italic uppercase mb-8">
          Quiénes <span className="text-sk-accent">Somos</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-body">
          Nacidos en XXXX, <span className="text-white font-bold">D7D</span> surgió con una misión simple: 
          unificar la pasión por los esports con un ambiente competitivo sano. 
          Lo que comenzó como un grupo de amigos en Discord, poco a poco se transformo en una gran comunidad/organización
          que desafía los límites del rendimiento en LATAM.
        </p>
      </section>

      {/* 2. VALORES (Deportes electrónicos igualitarios) */}
      <section className="bg-sk-dark py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ValueCard 
              icon={<Users size={40} />}
              title="Comunidad" 
              desc="Más que un equipo, somos una familia. Fomentamos el respeto y la inclusión en cada partida."
            />
            <ValueCard 
              icon={<Target size={40} />}
              title="Competición" 
              desc="Buscamos la excelencia. Entrenamos duro para dominar en cada torneo en el que participamos."
            />
            <ValueCard 
              icon={<Trophy size={40} />}
              title="Igualdad" 
              desc="Deportes electrónicos igualitarios. El talento no tiene género ni fronteras en D7D."
            />
          </div>
        </div>
      </section>

      {/* 3. GENTE / STAFF (Ejemplo simple) */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold uppercase italic mb-10 border-l-4 border-sk-accent pl-4">
          Nuestro Staff
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {["CEO", "Manager", "Coach", "Designer"].map((role, i) => (
            <div key={i} className="bg-[#111] p-6 border border-white/5 hover:border-sk-accent transition-colors group">
              <div className="w-20 h-20 bg-gray-800 rounded-full mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                {/* <img src="..." /> aquí iría la foto real */}
              </div>
              <h3 className="text-xl font-bold uppercase">Nombre {i+1}</h3>
              <p className="text-sk-accent text-sm font-bold uppercase">{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CONTACTO */}
      <section className="max-w-7xl mx-auto px-4 text-center py-20 bg-gradient-to-b from-transparent to-sk-accent/10 rounded-3xl">
        <Mail className="mx-auto text-sk-accent mb-4" size={50} />
        <h2 className="text-4xl font-black uppercase mb-4">Contáctanos</h2>
        <p className="text-gray-400 mb-8">¿Quieres ser partner o unirte al equipo?</p>
        <a href="mailto:contacto@d7d.com" className="bg-white text-black px-8 py-3 font-bold uppercase hover:bg-sk-accent hover:text-white transition-colors">
          Enviar Correo
        </a>
      </section>
    </div>
  );
}

// Componente auxiliar para las tarjetas de valores
function ValueCard({icon, title, desc}: {icon:any, title:string, desc:string}) {
  return (
    <div className="text-center p-8 hover:bg-white/5 rounded-lg transition-colors">
      <div className="text-sk-accent flex justify-center mb-6">{icon}</div>
      <h3 className="text-2xl font-bold uppercase mb-4">{title}</h3>
      <p className="text-gray-400 font-body">{desc}</p>
    </div>
  )
}