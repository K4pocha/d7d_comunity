"use client";

import { useAuth } from "../context/AuthContext";
import { Check, X, Palette, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeSelectionModal() {
  const { isThemeModalOpen, closeThemeModal, currentTheme, applyTheme, saveThemeToDB, user } = useAuth();
  const [previewTheme, setPreviewTheme] = useState(currentTheme);

  // Sincronizar el estado local con el contexto cuando se abre
  useEffect(() => {
    if (isThemeModalOpen) {
      setPreviewTheme(currentTheme);
    }
  }, [isThemeModalOpen, currentTheme]);

  if (!isThemeModalOpen) return null;

  const handlePreview = (theme: string) => {
    setPreviewTheme(theme);
    applyTheme(theme); // Cambia el CSS visualmente (sin guardar en BD aún)
  };

  const handleConfirm = () => {
    saveThemeToDB(previewTheme); // AQUÍ es donde guardamos en la BD realmente
    closeThemeModal();
  };

  const handleCancel = () => {
    // Si cancela, revertimos al tema que tenía antes de abrir el modal (opcional, o dejar el que seleccionó)
    // Para simplificar, asumiremos que si cancela se queda con lo que haya tocado o puedes revertirlo.
    // Aquí simplemente cerramos.
    closeThemeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop con blur */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleCancel}></div>
      
      <div className="relative z-10 w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in-up">
        
        <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-sk-accent/20 rounded-full flex items-center justify-center mb-4 text-sk-accent">
                <Palette size={24} />
            </div>
            <h2 className="text-2xl font-black italic uppercase text-white mb-2">Elige tu Estilo</h2>
            <p className="text-gray-400 text-sm">Personaliza la interfaz de D7D Network. <br/> Puedes cambiarlo cuando quieras.</p>
        </div>

        {/* Opciones */}
        <div className="grid grid-cols-2 gap-4 mb-8">
            {/* OPCIÓN CYAN (BLUE) */}
            <button 
                onClick={() => handlePreview('blue')}
                className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                    previewTheme === 'blue' 
                    ? "border-[#22d3ee] bg-[#22d3ee]/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]" 
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
            >
                <div className="w-8 h-8 rounded-full bg-[#22d3ee] shadow-lg"></div>
                <span className={`text-xs font-bold uppercase tracking-widest ${previewTheme === 'blue' ? "text-[#22d3ee]" : "text-gray-400"}`}>Cyber Blue</span>
                {previewTheme === 'blue' && <div className="absolute top-2 right-2 text-[#22d3ee]"><Check size={16}/></div>}
            </button>

            {/* OPCIÓN PINK */}
            <button 
                onClick={() => handlePreview('pink')}
                className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                    previewTheme === 'pink' 
                    ? "border-[#ec4899] bg-[#ec4899]/10 shadow-[0_0_20px_rgba(236,72,153,0.2)]" 
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
            >
                <div className="w-8 h-8 rounded-full bg-[#ec4899] shadow-lg"></div>
                <span className={`text-xs font-bold uppercase tracking-widest ${previewTheme === 'pink' ? "text-[#ec4899]" : "text-gray-400"}`}>Neon Pink</span>
                {previewTheme === 'pink' && <div className="absolute top-2 right-2 text-[#ec4899]"><Check size={16}/></div>}
            </button>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3">
            <button 
                onClick={handleCancel}
                className="flex-1 py-3 rounded-lg border border-white/10 text-gray-400 font-bold uppercase text-xs hover:bg-white/5 transition-colors"
            >
                Cancelar
            </button>
            <button 
                onClick={handleConfirm}
                className="flex-[2] py-3 rounded-lg bg-sk-accent text-black font-black uppercase text-xs hover:brightness-110 transition-all shadow-[0_0_15px_var(--color-sk-accent)]"
            >
                Confirmar Estilo
            </button>
        </div>

        {!user && (
            <p className="text-center text-[10px] text-gray-600 mt-6 uppercase tracking-widest">
                * Se guardará en este dispositivo
            </p>
        )}
      </div>
    </div>
  );
}