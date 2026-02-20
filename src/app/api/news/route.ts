import { NextResponse } from "next/server";
import { pool } from "../../../lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { writeFile } from "fs/promises";
import path from "path";

// Evita caché
export const dynamic = 'force-dynamic';

async function getUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("myTokenName");
  if (!token) return null;
  try {
    const decoded: any = jwt.verify(token.value, "secret-key-super-segura");
    return decoded;
  } catch (error) { return null; }
}

// 1. CREAR NOTICIA (POST)
export async function POST(request: Request) {
  try {
    const user: any = await getUserSession();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const summary = formData.get("summary") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string; 
    const file = formData.get("image") as File;

    let imageUrl = "/news-placeholder.jpg"; 

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      // Limpiamos el nombre del archivo para evitar caracteres raros
      const safeFileName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
      const fileName = `${Date.now()}-${safeFileName}`;
      
      const uploadDir = path.join(process.cwd(), "public/uploads");
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${fileName}`;
    }

    const [result]: any = await pool.query(
      "INSERT INTO news (title, summary, content, category, image, author_id) VALUES (?, ?, ?, ?, ?, ?)",
      [title, summary || "", content, category || "General", imageUrl, user.id]
    );

    return NextResponse.json({ message: "Noticia publicada", id: result.insertId });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}

// 2. LEER NOTICIAS (GET)
export async function GET() {
  try {    
    const [rows]: any = await pool.query(
      `SELECT news.id, news.title, news.summary, news.content, news.category, news.image, news.created_at, 
              u.nickname as author_name, u.avatar as author_avatar 
       FROM news 
       LEFT JOIN \`user\` as u ON news.author_id = u.id 
       ORDER BY news.id DESC`
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error API News:", error);
    return NextResponse.json({ message: "Error al cargar noticias" }, { status: 500 });
  }
}

// 3. ELIMINAR NOTICIA (DELETE)
export async function DELETE(request: Request) {
  try {
    const user: any = await getUserSession();
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ message: "No autorizado" }, { status: 403 });

    const { id } = await request.json();
    if (!id) return NextResponse.json({ message: "Falta ID" }, { status: 400 });

    await pool.query("DELETE FROM news WHERE id = ?", [id]);
    return NextResponse.json({ message: "Eliminado" });

  } catch (error) {
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}