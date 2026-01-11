import Image from "next/image";

export default function PartnerRow() {
  // Creamos un array de 10 elementos para repetir el logo
  const partners = Array(10).fill("/LogoDisplaced.png");

  return (
    <div className="w-full bg-black border-y border-white/10 overflow-hidden py-6 relative z-20">
      <div className="flex w-[200%] animate-marquee items-center">
        {/* Renderizamos dos veces la lista para el efecto infinito */}
        {[...partners, ...partners].map((logo, index) => (
          <div key={index} className="flex-shrink-0 mx-12 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
            <Image 
              src={logo} 
              alt="Sponsor" 
              width={150} 
              height={50} 
              className="h-12 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}