"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  nickname: string;
  email: string;
  avatar?: string;
  role: string;
  theme?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  
  // Nuevas funciones para el tema
  currentTheme: string;
  isThemeModalOpen: boolean;
  openThemeModal: () => void;
  closeThemeModal: () => void;
  applyTheme: (themeName: string) => void; // Solo visual
  saveThemeToDB: (themeName: string) => void; // Guardado real
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentTheme, setCurrentTheme] = useState("blue");
  
  // Estado para controlar el Modal
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  
  const router = useRouter();

  // Función 1: Solo aplica CSS y guarda en localStorage (Rápido)
  const applyTheme = (themeName: string) => {
    const root = document.documentElement;
    if (themeName === 'pink') {
      root.style.setProperty('--color-sk-accent', '#ec4899');
    } else {
      root.style.setProperty('--color-sk-accent', '#22d3ee');
    }
    setCurrentTheme(themeName);
    localStorage.setItem("d7d-theme", themeName);
  };

  // Función 2: Guarda en la BD (Lento, solo al confirmar)
  const saveThemeToDB = async (themeName: string) => {
    // Primero aseguramos que esté aplicado localmente
    applyTheme(themeName);

    // Si hay usuario, mandamos la petición a la API
    if (user) {
      const updatedUser = { ...user, theme: themeName };
      setUser(updatedUser);
      localStorage.setItem("d7d_user", JSON.stringify(updatedUser));

      try {
        await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme: themeName }),
        });
      } catch (error) {
        console.error("Error guardando tema en BD", error);
      }
    }
  };

  useEffect(() => {
    // 1. Cargar Usuario
    const storedUser = localStorage.getItem("d7d_user");
    let loadedUser: User | null = null;
    if (storedUser) {
      loadedUser = JSON.parse(storedUser);
      setUser(loadedUser);
    }

    // 2. DETECTAR PRIMERA VISITA O TEMA GUARDADO
    const storedTheme = localStorage.getItem("d7d-theme");
    
    if (loadedUser?.theme) {
      // Si el usuario tiene tema en BD, manda ese
      applyTheme(loadedUser.theme);
    } else if (storedTheme) {
      // Si hay preferencia local, manda esa
      applyTheme(storedTheme);
    } else {
      // --- MAGIA: PRIMERA VEZ ---
      // Si no hay usuario NI tema local, es la primera vez (o limpiaron caché).
      // Abrimos el modal automáticamente.
      applyTheme("blue"); // Default
      setIsThemeModalOpen(true);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("d7d_user", JSON.stringify(userData));
    if (userData.theme) applyTheme(userData.theme);
    router.push("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("d7d_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, 
      currentTheme, 
      isThemeModalOpen, 
      openThemeModal: () => setIsThemeModalOpen(true),
      closeThemeModal: () => setIsThemeModalOpen(false),
      applyTheme,
      saveThemeToDB 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}