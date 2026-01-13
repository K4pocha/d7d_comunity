import { NextResponse } from "next/server";
import { pool } from "../../../../lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("myTokenName");

  if (!token) return false;

  try {
    const decoded: any = jwt.verify(token.value, "secret-key-super-segura");
    return decoded.role === 'ADMIN';
  } catch {
    return false;
  }
}

// 1. OBTENER LISTA DE USUARIOS (GET)
export async function GET() {
  // Verificamos si es admin
  if (!(await isAdmin())) return NextResponse.json({ message: "No autorizado" }, { status: 403 });

  try {
    const [rows]: any = await pool.query(
      "SELECT id, nickname, email, role, avatar, createdAt FROM `user` ORDER BY id DESC"
    );
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error fetching users:", error); // Esto te mostrará el error real en la consola
    // Agregamos esto para ver el error real si sigue fallando
    return NextResponse.json({ message: "Error interno", detail: error.message }, { status: 500 });
  }
}

// 2. CAMBIAR ROL DE USUARIO (PUT)
export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ message: "No autorizado" }, { status: 403 });

  try {
    const { userId, newRole } = await request.json();

    const validRoles = ['USER', 'ADMIN', 'MOD'];
    if (!validRoles.includes(newRole)) {
      return NextResponse.json({ message: "Rol inválido" }, { status: 400 });
    }

    await pool.query("UPDATE `user` SET role = ? WHERE id = ?", [newRole, userId]);

    return NextResponse.json({ message: "Rol actualizado correctamente" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error al actualizar rol" }, { status: 500 });
  }
}