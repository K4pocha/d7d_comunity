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
      "INSERT INTO News (title, content, category, image, author_id) VALUES (?, ?, ?, ?, ?)",
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
    // NUEVO: Traemos también la columna 'category'
    const [rows]: any = await pool.query(
      `SELECT News.id, News.title, News.content, News.category, News.image, News.created_at, 
              User.nickname as author_name, User.avatar as author_avatar 
       FROM News 
       LEFT JOIN User ON News.author_id = User.id 
       ORDER BY created_at DESC`
    );

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ message: "Error al cargar noticias" }, { status: 500 });
  }
}