"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  nickname: string;
  email: string;
  avatar?: string;
  role: string;
  theme?: string; // Ahora guardará el HEX ej: "#ff0000"
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  currentTheme: string; // Guardará el HEX actual
  isThemeModalOpen: boolean;
  openThemeModal: () => void;
  closeThemeModal: () => void;
  applyTheme: (colorHex: string) => void; 
  saveThemeToDB: (colorHex: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Color por defecto (Cyan D7D)
const DEFAULT_COLOR = "#00f2ff";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_COLOR);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const router = useRouter();

  // --- APLICAR COLOR (Cualquier HEX) ---
  const applyTheme = (colorHex: string) => {
    if (!colorHex) return;
    
    // Inyectamos el valor HEX directamente en la variable CSS
    const root = document.documentElement;
    root.style.setProperty('--color-sk-accent', colorHex);
    
    setCurrentTheme(colorHex);
    localStorage.setItem("d7d-theme", colorHex);
  };

  const saveThemeToDB = async (colorHex: string) => {
    applyTheme(colorHex);
    
    if (user) {
      const updatedUser = { ...user, theme: colorHex };
      setUser(updatedUser);
      localStorage.setItem("d7d_user", JSON.stringify(updatedUser));
      
      try {
        await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme: colorHex }),
        });
      } catch (error) {
        console.error("Error guardando tema", error);
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

    // 2. Cargar Tema
    const storedTheme = localStorage.getItem("d7d-theme");
    
    // Lógica de prioridad: Usuario BD > LocalStorage > Default
    if (loadedUser?.theme) {
      applyTheme(loadedUser.theme);
    } else if (storedTheme) {
      applyTheme(storedTheme);
    } else {
      applyTheme(DEFAULT_COLOR);
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
      applyTheme, saveThemeToDB 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
}