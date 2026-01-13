import { NextResponse } from "next/server";
import { pool } from "../../../lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { writeFile } from "fs/promises";
import path from "path";

// 1. IMPORTANTE: Esto obliga a que la API se actualice siempre (evita caché vieja)
export const dynamic = 'force-dynamic';

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
    const category = formData.get("category") as string; 
    const file = formData.get("image") as File;

    let imageUrl = "/news-placeholder.jpg"; // Asegúrate de tener esta imagen en public/

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      // Limpiamos el nombre del archivo para evitar errores en Linux
      const safeFileName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
      const fileName = `${Date.now()}-${safeFileName}`;
      
      const uploadDir = path.join(process.cwd(), "public/uploads");
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${fileName}`;
    }

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
    // CORRECCIONES APLICADAS AQUÍ:
    // 1. LEFT JOIN `user` (con backticks) para evitar error de palabra reservada.
    // 2. Usamos alias 'u' para simplificar.
    // 3. ORDER BY news.id DESC (Es lo más seguro para "Lo último primero").
    
    const [rows]: any = await pool.query(
      `SELECT news.id, news.title, news.content, news.category, news.image, news.created_at, 
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

// 3. ELIMINAR NOTICIA (Solo ADMIN)
export async function DELETE(request: Request) {
  try {
    // 1. Verificamos permisos (reusando tu función getUserSession)
    const user: any = await getUserSession();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    // 2. Obtenemos el ID a borrar
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "Se requiere el ID de la noticia" }, { status: 400 });
    }

    // 3. Ejecutamos el borrado en la base de datos
    await pool.query("DELETE FROM news WHERE id = ?", [id]);

    return NextResponse.json({ message: "Noticia eliminada correctamente" });

  } catch (error) {
    console.error("Error borrando noticia:", error);
    return NextResponse.json({ message: "Error interno al borrar" }, { status: 500 });
  }
}