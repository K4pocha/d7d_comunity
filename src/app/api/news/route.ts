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

// --- NUEVA FUNCIÓN: ENVIAR A DISCORD ---
async function sendToDiscord(newsData: any) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL; // Importante para que las imágenes se vean

  if (!webhookUrl || !siteUrl) {
    console.warn("⚠️ Faltan variables de entorno para Discord (DISCORD_WEBHOOK_URL o NEXT_PUBLIC_SITE_URL)");
    return;
  }

  // Construimos la URL absoluta de la imagen
  // Si la imagen ya es http... la dejamos, si es /uploads... le pegamos el dominio
  const imageUrl = newsData.image.startsWith("http") 
    ? newsData.image 
    : `${siteUrl}${newsData.image}`;

  const embed = {
    title: newsData.title,
    description: newsData.summary || "¡Nueva noticia publicada en la comunidad!",
    url: `${siteUrl}/noticias/${newsData.id}`, // Enlace directo a la noticia
    color: 0x00FF00, // Color verde (puedes cambiarlo)
    image: {
      url: imageUrl
    },
    footer: {
      text: `Categoría: ${newsData.category} • Publicado por Admin`
    },
    timestamp: new Date().toISOString()
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Noticias D7D", // El nombre que tendrá el bot
        embeds: [embed],
      }),
    });
    console.log("✅ Noticia enviada a Discord correctamente.");
  } catch (error) {
    console.error("❌ Error enviando a Discord:", error);
    // No lanzamos error para no romper la creación de la noticia si Discord falla
  }
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

    // --- MODIFICACIÓN AQUÍ ---
    // Necesitamos capturar el resultado para obtener el ID de la nueva noticia
    // Usamos 'any' para evitar quejas de TypeScript sobre la estructura de retorno de mysql2
    const [result]: any = await pool.query(
      "INSERT INTO news (title, summary, content, category, image, author_id) VALUES (?, ?, ?, ?, ?, ?)",
      [title, summary || "", content, category || "General", imageUrl, user.id]
    );
    
    // Obtenemos el ID de la fila recién insertada
    const newNewsId = result.insertId;

    // --- DISPARAR WEBHOOK ---
    // Llamamos a la función de forma asíncrona pero sin 'await' bloqueante 
    // si quieres que responda rápido al usuario, o con 'await' si quieres asegurar el envío.
    await sendToDiscord({
      id: newNewsId,
      title,
      summary,
      category: category || "General",
      image: imageUrl
    });

    return NextResponse.json({ message: "Noticia publicada", id: newNewsId });

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