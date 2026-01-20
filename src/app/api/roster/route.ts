import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// SEGURIDAD
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

// 1. GET: Obtener roster
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('game_id');
  if (!gameId) return NextResponse.json({ error: 'Game ID required' }, { status: 400 });

  try {
    const [rows] = await pool.query('SELECT * FROM roster WHERE game_id = ?', [gameId]);
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST: Agregar Jugador
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ message: "No autorizado" }, { status: 403 });

  try {
    const formData = await request.formData();
    
    // Procesar Imagen
    const file = formData.get("photo_file") as any;
    let photoUrl = ""; 

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
      const fileName = `${Date.now()}-${safeName}`;
      
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      
      await writeFile(filePath, buffer);
      photoUrl = `/uploads/${fileName}`;
    }

    // Datos Básicos
    const game_id = formData.get("game_id");
    const nickname = formData.get("nickname");
    const role = formData.get("role");
    const country = formData.get("country") || "CL";
    const bio = formData.get("bio") || "";
    
    const finalPhotoUrl = photoUrl || formData.get("photo_url") || "";

    // --- NUEVO: JSONs Actualizados (Redes Extra + Audífonos) ---
    const socials = JSON.stringify({
       twitter: formData.get("twitter"),
       twitch: formData.get("twitch"),
       instagram: formData.get("instagram"),
       tiktok: formData.get("tiktok"), // Nuevo
       kick: formData.get("kick"),     // Nuevo
       youtube: formData.get("youtube")// Nuevo
    });
    
    const setup = JSON.stringify({
       mouse: formData.get("mouse"),
       keyboard: formData.get("keyboard"),
       headphones: formData.get("headphones") // Nuevo (Reemplaza monitor conceptualmente)
    });

    await pool.query(
      'INSERT INTO roster (game_id, nickname, role, country, bio, photo_url, socials, setup) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [game_id, nickname, role, country, bio, finalPhotoUrl, socials, setup]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. PUT: Editar Jugador 
export async function PUT(request: Request) {
    if (!(await isAdmin())) return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  
    try {
      const formData = await request.formData();
      const id = formData.get("id");

      if (!id) return NextResponse.json({ error: "Falta ID" }, { status: 400 });

      // Imagen
      const file = formData.get("photo_file") as any; 
      let photoUrl = formData.get("existing_photo_url") as string; 

      if (file && file.name && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const safeName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
        const fileName = `${Date.now()}-${safeName}`;
        
        const uploadDir = path.join(process.cwd(), "public/uploads");
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        
        photoUrl = `/uploads/${fileName}`;
      }

      // Datos
      const nickname = formData.get("nickname") || "";
      const role = formData.get("role") || "";
      const country = formData.get("country") || "CL";
      const bio = formData.get("bio") || "";

      // --- NUEVO: JSONs Actualizados ---
      const socials = JSON.stringify({
        twitter: formData.get("twitter") || "",
        twitch: formData.get("twitch") || "",
        instagram: formData.get("instagram") || "",
        tiktok: formData.get("tiktok") || "",  // Nuevo
        kick: formData.get("kick") || "",      // Nuevo
        youtube: formData.get("youtube") || "" // Nuevo
      });
      
      const setup = JSON.stringify({
        mouse: formData.get("mouse") || "",
        keyboard: formData.get("keyboard") || "",
        headphones: formData.get("headphones") || "" // Nuevo
      });
  
      await pool.query(
        'UPDATE roster SET nickname=?, role=?, country=?, bio=?, photo_url=?, socials=?, setup=? WHERE id=?',
        [nickname, role, country, bio, photoUrl, socials, setup, id]
      );
  
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error("Error PUT Roster:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 4. DELETE
export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  try {
    const { id } = await request.json();
    await pool.query('DELETE FROM roster WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}