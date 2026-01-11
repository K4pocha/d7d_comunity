export default function PartnerRow() {
  const partners = ["PARTNER A", " PARTNER B", "CALIXTO MI DIOS", "SPONSORS"];

  return (
    <div className="w-full bg-black py-6 border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60">
        {partners.map((p, i) => (
          <span key={i} className="text-xl md:text-2xl font-black text-gray-500 hover:text-white transition-colors cursor-pointer select-none">
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}