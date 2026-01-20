"use client";

import { useAuth } from "../context/AuthContext";
import { Check, Palette, X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

// Presets oficiales "Gaming"
const PRESETS = [
    { name: 'Cyber Blue', color: '#00f2ff' }, // Cyan
    { name: 'Neon Pink', color: '#ff0099' },  // Magenta
    { name: 'Toxic Green', color: '#39ff14' },// Verde Razer
    { name: 'Ultra Purple', color: '#9333ea' },// Morado Twitch
    { name: 'Crimson Red', color: '#ff003c' },// Rojo Valorant
    { name: 'Golden Legend', color: '#ffd700' },// Dorado
];

export default function ThemeSelectionModal() {
  const { isThemeModalOpen, closeThemeModal, currentTheme, applyTheme, saveThemeToDB } = useAuth();
  const [previewColor, setPreviewColor] = useState(currentTheme);

  useEffect(() => {
    if (isThemeModalOpen) setPreviewColor(currentTheme);
  }, [isThemeModalOpen, currentTheme]);

  if (!isThemeModalOpen) return null;

  // Cambia el color en tiempo real
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setPreviewColor(newColor);
    applyTheme(newColor);
  };

  const handlePresetClick = (color: string) => {
    setPreviewColor(color);
    applyTheme(color);
  };

  const handleConfirm = () => {
    saveThemeToDB(previewColor);
    closeThemeModal();
  };

  const handleCancel = () => {
    // Opcional: Si quieres que al cancelar vuelva al color original, 
    // tendrías que guardar el color inicial en un estado al abrir.
    // Por ahora, simplemente cierra.
    closeThemeModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in">
      {/* Fondo Oscuro con Blur */}
      <div 
        className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md transition-opacity" 
        onClick={handleCancel}
      />
      
      {/* TARJETA PRINCIPAL */}
      <div 
        className="relative z-10 w-full max-w-sm bg-[#0a0a0a] border rounded-2xl overflow-hidden shadow-2xl transition-all duration-300"
        style={{ 
            borderColor: `${previewColor}40`, // Borde sutil del color elegido
            boxShadow: `0 0 40px -10px ${previewColor}30` // Resplandor exterior
        }}
      >
        {/* CABECERA */}
        <div className="relative p-6 text-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
            <button 
                onClick={handleCancel}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
                <X size={20} />
            </button>

            <div 
                className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-lg transition-colors duration-300"
                style={{ backgroundColor: `${previewColor}20`, color: previewColor }}
            >
                <Palette size={28} strokeWidth={1.5} />
            </div>
            
            <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none">
                Estilo <span style={{ color: previewColor }} className="transition-colors duration-300">Visual</span>
            </h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Personaliza tu experiencia</p>
        </div>

        <div className="p-6 space-y-8">
            
            {/* 1. SECCIÓN DE PRESETS (GRILLA) */}
            <div>
                <p className="text-[10px] font-black uppercase text-gray-500 mb-3 flex items-center gap-2">
                    <Sparkles size={12} /> Colores Oficiales
                </p>
                <div className="grid grid-cols-3 gap-3">
                    {PRESETS.map((preset) => (
                        <button 
                            key={preset.color}
                            onClick={() => handlePresetClick(preset.color)}
                            className="group relative h-12 rounded-lg border border-white/10 hover:border-white/30 transition-all overflow-hidden flex items-center justify-center"
                            title={preset.name}
                        >
                            {/* Fondo con opacidad */}
                            <div 
                                className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-40"
                                style={{ backgroundColor: preset.color }}
                            />
                            
                            {/* Punto de color */}
                            <div 
                                className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] transition-transform group-hover:scale-150"
                                style={{ backgroundColor: preset.color, color: preset.color }}
                            />

                            {/* Check si está activo */}
                            {previewColor === preset.color && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                                    <Check size={16} className="text-white drop-shadow-md" strokeWidth={3} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. COLOR PICKER PERSONALIZADO (BARRA RGB) */}
            <div>
                <div className="flex justify-between items-end mb-3">
                    <p className="text-[10px] font-black uppercase text-gray-500">Color Personalizado</p>
                    <p className="text-[10px] font-mono text-gray-400 uppercase">{previewColor}</p>
                </div>
                
                <div className="relative h-12 rounded-lg overflow-hidden border border-white/10 group cursor-pointer">
                    {/* Input invisible que cubre todo */}
                    <input 
                        type="color" 
                        value={previewColor}
                        onChange={handleColorChange}
                        className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                    />
                    
                    {/* Fondo visual: Gradiente RGB elegante */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Texto indicativo */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                        <span className="text-xs font-bold uppercase text-white drop-shadow-md tracking-wider group-hover:scale-110 transition-transform">
                            Toca para elegir
                        </span>
                    </div>
                </div>
            </div>

        </div>

        {/* FOOTER: BOTONES DE ACCIÓN */}
        <div className="p-4 bg-white/5 border-t border-white/10 flex gap-3">
            <button 
                onClick={handleCancel}
                className="flex-1 py-3 rounded-lg border border-white/10 text-gray-400 font-bold uppercase text-xs hover:bg-white/10 hover:text-white transition-colors"
            >
                Cancelar
            </button>
            <button 
                onClick={handleConfirm}
                className="flex-[2] py-3 rounded-lg text-black font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all shadow-lg active:scale-95"
                style={{ 
                    backgroundColor: previewColor,
                    boxShadow: `0 0 20px -5px ${previewColor}`
                }}
            >
                Confirmar
            </button>
        </div>
      </div>
    </div>
  );
}