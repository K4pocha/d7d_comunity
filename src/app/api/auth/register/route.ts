import { NextResponse } from "next/server";
import { pool } from "../../../../lib/db";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, nickname, password } = data;

    // --- 1. VALIDACIONES DE FORMATO ---

    // A. Validar campos vacíos
    if (!email || !nickname || !password) {
      return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // B. Validar formato de Email (Regex estándar)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "El formato del correo no es válido" }, { status: 400 });
    }

    // C. Validar Contraseña Segura
    // Mínimo 8 caracteres, al menos 1 número y 1 mayúscula
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ 
        message: "La contraseña es muy débil. Debe tener 8 caracteres, una mayúscula y un número." 
      }, { status: 400 });
    }

    // --- 2. ENCRIPTACIÓN Y GUARDADO ---

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result]: any = await pool.query(
      "INSERT INTO User (email, nickname, password) VALUES (?, ?, ?)",
      [email, nickname, hashedPassword]
    );

    return NextResponse.json({ 
      message: "Usuario creado exitosamente",
      id: result.insertId 
    });

  } catch (error: any) {
    console.error("Error Registro:", error);

    // --- 3. MANEJO DE DUPLICADOS (Usuario ya existe) ---
    // El código 1062 en MySQL significa "Duplicate Entry" (Violación de Unique)
    if (error.code === 'ER_DUP_ENTRY') {
      // Detectamos si fue el email o el nickname
      if (error.sqlMessage.includes("email")) {
        return NextResponse.json({ message: "Este correo ya está registrado" }, { status: 409 });
      }
      if (error.sqlMessage.includes("nickname")) {
        return NextResponse.json({ message: "Este nombre de usuario ya está ocupado" }, { status: 409 });
      }
      return NextResponse.json({ message: "El usuario ya existe" }, { status: 409 });
    }

    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}