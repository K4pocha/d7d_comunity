"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

// Definimos los colores aquí para tenerlos centralizados
const THEME_COLORS: Record<string, string> = {
  blue: "#00f2ff", // Cyan original
  pink: "#ff0099", // Rosa neón
  green: "#39ff14", // Verde tóxico (extra)
  purple: "#9333ea", // Morado (extra)
};

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
  currentTheme: string;
  isThemeModalOpen: boolean;
  openThemeModal: () => void;
  closeThemeModal: () => void;
  applyTheme: (themeName: string) => void; 
  saveThemeToDB: (themeName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentTheme, setCurrentTheme] = useState("blue");
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const router = useRouter();

  // --- FUNCIÓN CLAVE: CAMBIO DE COLOR ---
  const applyTheme = (themeName: string) => {
    const root = document.documentElement;
    const colorHex = THEME_COLORS[themeName] || THEME_COLORS['blue'];
    
    // Inyectamos el valor directamente en la variable CSS de Tailwind
    root.style.setProperty('--color-sk-accent', colorHex);
    
    setCurrentTheme(themeName);
    localStorage.setItem("d7d-theme", themeName);
  };

  const saveThemeToDB = async (themeName: string) => {
    applyTheme(themeName);
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
        console.error("Error guardando tema", error);
      }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("d7d_user");
    let loadedUser: User | null = null;
    if (storedUser) {
      loadedUser = JSON.parse(storedUser);
      setUser(loadedUser);
    }

    const storedTheme = localStorage.getItem("d7d-theme");
    
    // Prioridad: 1. Preferencia usuario BD, 2. LocalStorage, 3. Default Blue
    if (loadedUser?.theme) {
      applyTheme(loadedUser.theme);
    } else if (storedTheme) {
      applyTheme(storedTheme);
    } else {
      applyTheme("blue");
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