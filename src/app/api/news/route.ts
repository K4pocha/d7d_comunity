import { NextResponse } from "next/server";
import { pool } from "../../../lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { writeFile } from "fs/promises";
import path from "path";

async function getUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("myTokenName");

  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token.value, "secret-key-super-segura");
    return decoded;
  } catch (error) {
    return null;
  }
}

// 1. CREAR NOTICIA (Solo ADMIN)
export async function POST(request: Request) {
  try {
    const user: any = await getUserSession();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    // NUEVO: Recibimos la categoría
    const category = formData.get("category") as string; 
    const file = formData.get("image") as File;

    let imageUrl = "/news-placeholder.jpg";

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${fileName}`;
    }

    // NUEVO: Guardamos la categoría en la BD
    await pool.query(
      "INSERT INTO news (title, content, category, image, author_id) VALUES (?, ?, ?, ?, ?)",
      [title, content, category || "General", imageUrl, user.id]
    );

    return NextResponse.json({ message: "Noticia publicada" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}

// 2. LEER NOTICIAS (Público)
export async function GET() {
  try {    
    const [rows]: any = await pool.query(
      `SELECT news.id, news.title, news.content, news.category, news.image, news.created_at, 
              user.nickname as author_name, user.avatar as author_avatar 
       FROM news 
       LEFT JOIN user ON news.author_id = user.id 
       ORDER BY createdAt DESC`
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error API News:", error); // Esto te ayudará a ver el error real en los logs de cPanel
    return NextResponse.json({ message: "Error al cargar noticias" }, { status: 500 });
  }
}