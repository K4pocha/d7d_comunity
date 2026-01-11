import type { Metadata } from "next";
// 1. Importamos la fuente Oswald de Google
import { Oswald, Inter } from "next/font/google"; 
import "./globals.css";
import Navbar from "../components/Navbar";
import StreamBar from "../components/StreamBar"; 
import Footer from "../components/Footer";

// Configuración de la fuente gruesa
const oswald = Oswald({ 
  subsets: ["latin"], 
  variable: "--font-oswald",
  weight: ["400", "500", "700"], // Pesos normales y muy gruesos
});

// Fuente secundaria para textos largos (párrafos) para que se lea bien
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
        <Navbar />
        <StreamBar /> {/* Aquí va la barra de stream dinámica */}
        <main className="min-h-screen pt-0"> 
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}