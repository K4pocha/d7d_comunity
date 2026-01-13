import { NextResponse } from "next/server";
import { pool } from "../../../../lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Nota: Aunque la variable se llame 'email', aquí recibimos lo que el usuario escribió (Nick o Correo)
    const { email, password } = data;

    if (!email || !password) {
      return NextResponse.json({ message: "Faltan credenciales" }, { status: 400 });
    }

    // 1. CORRECCIÓN PRINCIPAL:
    // Buscamos en la columna 'email' O en la columna 'nickname' usando el mismo valor dos veces.
    const [rows]: any = await pool.query(
      "SELECT * FROM user WHERE email = ? OR nickname = ?", 
      [email, email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 401 });
    }

    const user = rows[0];

    // 2. Verificar contraseña
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Contraseña incorrecta" }, { status: 401 });
    }

    // 3. Generar Token
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
        avatar: user.avatar
      },
      "secret-key-super-segura" // Recuerda mover esto al .env en producción
    );

    // 4. Configurar Cookie
    const serialized = serialize("myTokenName", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // 5. Responder con los datos del usuario (Incluyendo el ROL que es importante para el Contexto)
    const response = NextResponse.json({
      message: "Login exitoso",
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar,
        role: user.role // Agregado para que tu Navbar sepa si es ADMIN o USER
      }
    });

    response.headers.set("Set-Cookie", serialized);
    return response;

  } catch (error) {
    console.error("Error Login:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}