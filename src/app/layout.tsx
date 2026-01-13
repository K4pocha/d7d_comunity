import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google"; 
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "../context/AuthContext";
// 1. IMPORTAMOS EL MODAL DE TEMAS
import ThemeSelectionModal from "../components/ThemeSelectionModal"; 

// Configuración de la fuente gruesa
const oswald = Oswald({ 
  subsets: ["latin"], 
  variable: "--font-oswald",
  weight: ["400", "500", "700"], 
});

// Fuente secundaria
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DIsp7aceD Network",
  description: "Sitio oficial DIsp7aceD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${oswald.variable} ${inter.variable} font-sans bg-sk-black text-white antialiased`}>
        
        {/* Envolvemos todo con el proveedor de autenticación y temas */}
        <AuthProvider>
          
          <Navbar />

          {/* 2. AGREGAMOS EL MODAL AQUÍ (Estará oculto por defecto) */}
          <ThemeSelectionModal />
          
          <main className="min-h-screen pt-0"> 
            {children}
          </main>
          
          <Footer />

        </AuthProvider>
        
      </body>
    </html>
  );
}