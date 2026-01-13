import { NextResponse } from "next/server";
import { pool } from "../../../../lib/db"; // Importamos nuestra conexión nueva
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, nickname, password } = data;

    if (!email || !nickname || !password) {
      return NextResponse.json({ message: "Faltan datos" }, { status: 400 });
    }

    // 1. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Insertar en la Base de Datos (SQL PURO)
    // Los signos '?' son por seguridad (evitan hackeos SQL Injection)
    const [result]: any = await pool.query(
      "INSERT INTO User (email, nickname, password, avatar, role) VALUES (?, ?, ?, ?, ?)",
      [email, nickname, hashedPassword, "/fondo.jpg", "USER"]
    );

    // 3. Responder
    return NextResponse.json({ 
      id: result.insertId, 
      email, 
      nickname 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error SQL:", error);

    // Si el error es código 'ER_DUP_ENTRY', es que el usuario ya existe
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ message: "El usuario o correo ya existen" }, { status: 409 });
    }

    return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
  }
}