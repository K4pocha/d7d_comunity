"use client";
import { useState, useEffect } from "react";
import { Paintbrush } from "lucide-react";

export default function ThemeToggle() {
  const [isPink, setIsPink] = useState(false);

  // Cada vez que 'isPink' cambie, actualizamos la clase del body
  useEffect(() => {
    if (isPink) {
      document.body.classList.add("theme-pink");
    } else {
      document.body.classList.remove("theme-pink");
    }
  }, [isPink]);

  return (
    <button 
      onClick={() => setIsPink(!isPink)}
      className={`
        p-2 rounded-md transition-all duration-300 border border-white/10
        ${isPink ? "bg-d7d-pink text-white shadow-[0_0_15px_#ff0080]" : "bg-sk-dark text-d7d-cyan hover:bg-white/10"}
      `}
      title="Cambiar Tema"
    >
      <Paintbrush size={18} />
    </button>
  );
}