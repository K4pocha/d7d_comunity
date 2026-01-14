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

// 2. POST: Agregar Jugador (Con Foto)
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ message: "No autorizado" }, { status: 403 });

  try {
    const formData = await request.formData();
    
    // Procesar Imagen
    const file = formData.get("photo_file") as File | null;
    let photoUrl = ""; // Si no sube foto, queda vacía o se mantiene la anterior logicamente

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      // Nombre seguro
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
      const fileName = `${Date.now()}-${safeName}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      const filePath = path.join(uploadDir, fileName);
      
      await writeFile(filePath, buffer);
      photoUrl = `/uploads/${fileName}`;
    }

    // Extraer resto de datos
    const game_id = formData.get("game_id");
    const nickname = formData.get("nickname");
    const role = formData.get("role");
    const country = formData.get("country") || "CL";
    const bio = formData.get("bio") || "";
    
    // Si el usuario subió foto, usamos esa. Si no, revisamos si mandó una URL manual (opcional)
    const finalPhotoUrl = photoUrl || formData.get("photo_url") || "";

    // Construir JSONs
    const socials = JSON.stringify({
       twitter: formData.get("twitter"),
       twitch: formData.get("twitch"),
       instagram: formData.get("instagram")
    });
    const setup = JSON.stringify({
       mouse: formData.get("mouse"),
       keyboard: formData.get("keyboard"),
       monitor: formData.get("monitor")
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

      // 1. Manejo de la Imagen
      const file = formData.get("photo_file") as any; // Usamos 'any' temporalmente para evitar problemas de tipado estricto
      let photoUrl = formData.get("existing_photo_url") as string; 

      // Verificación más robusta: revisamos si tiene nombre y tamaño
      if (file && file.name && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Limpiamos el nombre
        const safeName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
        const fileName = `${Date.now()}-${safeName}`;
        
        const uploadDir = path.join(process.cwd(), "public/uploads");
        
        // --- FIX CRÍTICO: Aseguramos que la carpeta exista antes de escribir ---
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        
        photoUrl = `/uploads/${fileName}`;
      }

      // 2. Extracción de datos
      const nickname = formData.get("nickname") || "";
      const role = formData.get("role") || "";
      const country = formData.get("country") || "CL";
      const bio = formData.get("bio") || "";

      // 3. JSONs
      const socials = JSON.stringify({
        twitter: formData.get("twitter") || "",
        twitch: formData.get("twitch") || "",
        instagram: formData.get("instagram") || ""
      });
      
      const setup = JSON.stringify({
        mouse: formData.get("mouse") || "",
        keyboard: formData.get("keyboard") || "",
        monitor: formData.get("monitor") || ""
      });
  
      // 4. Update
      await pool.query(
        'UPDATE roster SET nickname=?, role=?, country=?, bio=?, photo_url=?, socials=?, setup=? WHERE id=?',
        [nickname, role, country, bio, photoUrl, socials, setup, id]
      );
  
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error("Error PUT Roster Completo:", error); // Esto saldrá en los logs de cPanel (stderr.log)
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