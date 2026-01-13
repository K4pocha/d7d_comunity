"use client";

import { useAuth } from "../context/AuthContext";
import { Zap } from "lucide-react";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const { openThemeModal, currentTheme } = useAuth(); // Usamos openThemeModal
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-8 h-8" />;

  const isPink = currentTheme === 'pink';

  return (
    <button
      onClick={openThemeModal} // <--- AHORA ABRE EL MODAL
      title="Personalizar Tema"
      className={`group relative flex items-center justify-center w-8 h-8 rounded transition-all duration-500 ${
        isPink 
          ? "bg-pink-500/10 hover:bg-pink-500/20 text-pink-500" 
          : "bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400"
      }`}
    >
      <Zap
        size={18}
        className={`transition-all duration-500 ${
            isPink 
              ? "drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" 
              : "drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
        }`}
        fill="currentColor"
      />
    </button>
  );
}