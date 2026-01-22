import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

// Seguridad Admin
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("myTokenName");
  if (!token) return false;
  try {
    const decoded: any = jwt.verify(token.value, "secret-key-super-segura");
    return decoded.role === 'ADMIN';
  } catch { return false; }
}

// 1. GET: Obtener todos los items
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM media_kit ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ message: "Error al obtener media" }, { status: 500 });
  }
}

// 2. POST: Subir Nuevo Item
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ message: "No autorizado" }, { status: 403 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const type = formData.get("type") as string;

    if (!file || !title || !type) {
      return NextResponse.json({ message: "Faltan datos" }, { status: 400 });
    }

    // Guardar archivo físico
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Carpeta específica para orden
    const uploadDir = path.join(process.cwd(), "public/uploads/media");
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/media/${fileName}`;

    // Guardar en BD
    await pool.query(
      "INSERT INTO media_kit (title, type, image_url) VALUES (?, ?, ?)",
      [title, type, imageUrl]
    );

    return NextResponse.json({ message: "Subido correctamente" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}

// 3. DELETE: Borrar Item
export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ message: "No autorizado" }, { status: 403 });

  try {
    const { id } = await request.json();
    
    // (Opcional) Primero podríamos buscar el archivo para borrarlo del disco, 
    // pero por seguridad/simplicidad borramos el registro de la BD primero.
    await pool.query("DELETE FROM media_kit WHERE id = ?", [id]);

    return NextResponse.json({ message: "Eliminado correctamente" });
  } catch (error) {
    return NextResponse.json({ message: "Error al eliminar" }, { status: 500 });
  }
}