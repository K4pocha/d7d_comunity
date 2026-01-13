import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google"; 
import "./globals.css";
import Navbar from "../components/Navbar";
// import StreamBar from "../components/StreamBar"; <--- ELIMINADO (Ya está dentro de Navbar)
import Footer from "../components/Footer";
import { AuthProvider } from "../context/AuthContext"; // <--- 1. IMPORTACIÓN NUEVA

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
        
        {/* 2. ENVOLVEMOS TODO CON AUTHPROVIDER */}
        <AuthProvider>
          
          <Navbar />
          
          {/* <StreamBar />  <--- ELIMINADO AQUÍ para evitar duplicados */}
          
          <main className="min-h-screen pt-0"> 
            {children}
          </main>
          
          <Footer />

        </AuthProvider>
        
      </body>
    </html>
  );
}