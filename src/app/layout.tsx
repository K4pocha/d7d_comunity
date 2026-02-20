import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google"; 
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "../context/AuthContext";
// 1. IMPORTAMOS EL MODAL DE TEMAS
import ThemeSelectionModal from "../components/ThemeSelectionModal"; 

// Configuración de la fuente gruesa
const orbitron = Orbitron({ 
  subsets: ["latin"], 
  variable: "--font-orbitron", //mantenemos variable para no dejar la caga
  weight: ["400", "500", "700", "900"], 
});

// Fuente secundaria
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DIsp7aceD Network | Comunidad de Esports y Videojuegos en Chile",
  description: "Únete a DIsp7aceD, la mejor comunidad competitiva de videojuegos, torneos y Esports en Chile. Encuentra equipos de Valorant, CS2, League of Legends y más.",
  keywords: ["esports", "chile", "videojuegos", "torneos", "comunidad gamer", "valorant chile", "cs2 chile", "league of legends chile", "disp7aced", "delta force"],
  openGraph: {
    title: "DIsp7aceD Network | Esports Chile",
    description: "Comunidad de videojuegos y torneos en Chile.",
    url: "https://d7d.cl",
    siteName: "DIsp7aceD",
    images: [
      {
        url: "/LogoDisplacedCompleto.png", 
        width: 800,
        height: 600,
      },
    ],
    locale: "es_CL",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${orbitron.variable} ${inter.variable} font-sans bg-sk-black text-white antialiased`}>
        
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