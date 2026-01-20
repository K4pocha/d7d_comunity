"use client";

import { useAuth } from "../context/AuthContext";
import { Check, Palette, X } from "lucide-react";
import { useEffect, useState } from "react";

// Definimos la info visual de los temas
const THEMES = [
    { id: 'blue', name: 'Cyber Blue', color: '#00f2ff' },
    { id: 'pink', name: 'Neon Pink', color: '#ff0099' },
    { id: 'green', name: 'Toxic Green', color: '#39ff14' },
    { id: 'purple', name: 'Ultra Purple', color: '#9333ea' },
];

export default function ThemeSelectionModal() {
  const { isThemeModalOpen, closeThemeModal, currentTheme, applyTheme, saveThemeToDB } = useAuth();
  const [previewTheme, setPreviewTheme] = useState(currentTheme);

  useEffect(() => {
    if (isThemeModalOpen) setPreviewTheme(currentTheme);
  }, [isThemeModalOpen, currentTheme]);

  if (!isThemeModalOpen) return null;

  const handlePreview = (theme: string) => {
    setPreviewTheme(theme);
    applyTheme(theme); // Vista previa instantánea
  };

  const handleConfirm = () => {
    saveThemeToDB(previewTheme);
    closeThemeModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeThemeModal}></div>
      
      <div className="relative z-10 w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-fade-in-up">
        
        <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white">
                <Palette size={24} />
            </div>
            <h2 className="text-2xl font-black italic uppercase text-white mb-2">Elige tu Estilo</h2>
            <p className="text-gray-400 text-sm">Personaliza la interfaz de D7D Network.</p>
        </div>

        {/* Grid de Opciones */}
        <div className="grid grid-cols-2 gap-4 mb-8">
            {THEMES.map((theme) => (
                <button 
                    key={theme.id}
                    onClick={() => handlePreview(theme.id)}
                    // Estilo dinámico: Si está seleccionado, usamos SU color para el borde y fondo
                    style={{ 
                        borderColor: previewTheme === theme.id ? theme.color : 'rgba(255,255,255,0.1)',
                        backgroundColor: previewTheme === theme.id ? `${theme.color}15` : 'rgba(255,255,255,0.05)',
                        boxShadow: previewTheme === theme.id ? `0 0 20px ${theme.color}40` : 'none'
                    }}
                    className="relative p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 group"
                >
                    {/* Círculo de color */}
                    <div 
                        className="w-8 h-8 rounded-full shadow-lg transition-transform group-hover:scale-110"
                        style={{ backgroundColor: theme.color }}
                    ></div>
                    
                    {/* Nombre */}
                    <span 
                        className="text-xs font-bold uppercase tracking-widest transition-colors"
                        style={{ color: previewTheme === theme.id ? theme.color : '#9ca3af' }}
                    >
                        {theme.name}
                    </span>

                    {/* Check de seleccionado */}
                    {previewTheme === theme.id && (
                        <div className="absolute top-2 right-2" style={{ color: theme.color }}>
                            <Check size={16}/>
                        </div>
                    )}
                </button>
            ))}
        </div>

        <div className="flex gap-3">
            <button onClick={closeThemeModal} className="flex-1 py-3 rounded-lg border border-white/10 text-gray-400 font-bold uppercase text-xs hover:bg-white/5 transition-colors">
                Cancelar
            </button>
            <button 
                onClick={handleConfirm}
                className="flex-[2] py-3 rounded-lg text-black font-black uppercase text-xs hover:brightness-110 transition-all"
                style={{ 
                    backgroundColor: 'var(--color-sk-accent)', 
                    boxShadow: '0 0 15px var(--color-sk-accent)' 
                }}
            >
                Confirmar
            </button>
        </div>
      </div>
    </div>
  );
}