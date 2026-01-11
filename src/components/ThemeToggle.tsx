"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

export default function ThemeToggle() {
  const [isPink, setIsPink] = useState(false);
  // Best Practice: Evitamos "Hydration Mismatch" (diferencia entre servidor/cliente)
  // asegurándonos de renderizar solo cuando el componente esté montado en el cliente.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Lectura de LocalStorage: Solo accesible en el cliente (window/document existen).
    const savedTheme = localStorage.getItem("d7d-theme");
    
    // 2. Sincronización de Estado: Si existe preferencia previa, la aplicamos.
    // Esto mejora la UX al recordar la elección del usuario entre sesiones.
    if (savedTheme === "pink") {
      setIsPink(true);
      document.documentElement.style.setProperty("--color-sk-accent", "#ec4899");
    } else {
      setIsPink(false);
      document.documentElement.style.setProperty("--color-sk-accent", "#22d3ee");
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newStatus = !isPink;
    setIsPink(newStatus);

    // 3. Lógica de Cambio de Tema:
    // Manipulamos directamente la variable CSS global (--color-sk-accent)
    // para un cambio instantáneo y guardamos la preferencia.
    if (newStatus) {
      document.documentElement.style.setProperty("--color-sk-accent", "#ec4899");
      localStorage.setItem("d7d-theme", "pink");
    } else {
      document.documentElement.style.setProperty("--color-sk-accent", "#22d3ee");
      localStorage.setItem("d7d-theme", "cyan");
    }
  };

  // Renderizado condicional: Retornamos un placeholder invisible hasta que
  // el cliente termine de cargar para evitar parpadeos visuales (FOUC).
  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={toggleTheme}
      // Accessibility: Siempre incluir title o aria-label en botones de solo icono.
      title={isPink ? "Cambiar a Modo Cyan" : "Cambiar a Modo Pink"}
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