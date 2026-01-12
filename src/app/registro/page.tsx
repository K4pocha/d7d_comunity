"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Para redirigir al login
import { User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validación básica de frontend
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      // LLAMADA A TU API (BACKEND)
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: formData.nickname,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al registrarse");
      }

      // ÉXITO
      setSuccess(true);
      console.log("✅ UI: Registro simulado exitoso. Redirigiendo...");
      // Redirigir al login después de 2 segundos
      setTimeout(() => router.push("/login"), 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-black overflow-hidden pt-20 pb-20">

      {/* FONDO */}
      <div className="absolute inset-0 z-0">
        <Image src="/fondo.jpg" alt="Background" fill className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-black uppercase italic text-white tracking-wider">
              Nuevo <span className="text-sk-accent">Usuario</span>
            </h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">Crea tu cuenta en D7D Network</p>
          </div>

          {/* MENSAJES DE ESTADO */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded flex items-center gap-2 text-red-500 text-sm font-bold">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded flex items-center gap-2 text-green-500 text-sm font-bold animate-pulse">
              <CheckCircle2 size={18} /> ¡Registro exitoso! Redirigiendo...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NICKNAME */}
            <div className="group">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Nickname</label>
              <div className="relative flex items-center">
                <User size={18} className="absolute left-4 text-gray-500 group-focus-within:text-sk-accent transition-colors" />
                <input
                  name="nickname"
                  type="text"
                  placeholder="Ej: K4POCHA"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-sk-accent focus:bg-white/10 transition-all font-medium text-sm"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="group">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Correo Electrónico</label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-4 text-gray-500 group-focus-within:text-sk-accent transition-colors" />
                <input
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-sk-accent focus:bg-white/10 transition-all font-medium text-sm"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="group">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Contraseña</label>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-4 text-gray-500 group-focus-within:text-sk-accent transition-colors" />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-sk-accent focus:bg-white/10 transition-all font-medium text-sm"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="group">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Confirmar Contraseña</label>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-4 text-gray-500 group-focus-within:text-sk-accent transition-colors" />
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-sk-accent focus:bg-white/10 transition-all font-medium text-sm"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full bg-sk-accent text-white font-black uppercase py-3 rounded-lg hover:brightness-110 hover:shadow-[0_0_20px_var(--color-sk-accent)] transition-all duration-300 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Procesando..." : success ? "¡Listo!" : "Registrarse"}
              {!isLoading && !success && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-sk-accent font-bold hover:underline decoration-2 underline-offset-4">
              Iniciar Sesión
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}