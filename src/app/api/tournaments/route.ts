import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db'; 
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Función auxiliar de Admin
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("myTokenName"); // Cambia por el nombre real de tu cookie
  if (!token) return false;
  try {
    const decoded: any = jwt.verify(token.value, "secret-key-super-segura");
    return decoded.role === 'ADMIN';
  } catch { return false; }
}

// GET: Obtener torneos
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const [rows]: any = await pool.query("SELECT * FROM tournaments WHERE id = ?", [id]);
      return NextResponse.json(rows[0]);
    }
    const [rows] = await pool.query("SELECT * FROM tournaments ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// POST: Crear Torneo (Con datos neutros / Por definir)
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ message: "No autorizado" }, { status: 403 });

  try {
    const data = await request.json();
    
    // Un bracket vacío genérico para que no se rompa la vista del torneo
    const defaultBracket = {
        rounds: [
            { name: "Cuartos de Final", matches: [ {p1:"TBD", p2:"TBD", s1:0, s2:0}, {p1:"TBD", p2:"TBD", s1:0, s2:0}, {p1:"TBD", p2:"TBD", s1:0, s2:0}, {p1:"TBD", p2:"TBD", s1:0, s2:0} ] },
            { name: "Semifinal", matches: [ {p1:"TBD", p2:"TBD", s1:0, s2:0}, {p1:"TBD", p2:"TBD", s1:0, s2:0} ] },
            { name: "Gran Final", matches: [ {p1:"TBD", p2:"TBD", s1:0, s2:0} ] }
        ]
    };

    // Insertamos el torneo con valores explícitamente neutros
    await pool.query(
      `INSERT INTO tournaments 
      (title, game, start_date, bracket_data, status, banner_url, format, mode, slots, region, type, prize_1, prize_2, prize_3, entry_fee) 
      VALUES (?, ?, ?, ?, 'Inscripciones', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title, 
        data.game, 
        data.start_date || new Date(), 
        JSON.stringify(defaultBracket),
        null,            // banner_url (Al ser null, el frontend mostrará el de defecto)
        'Por definir',   // format
        'Por definir',   // mode
        '0 / 0',         // slots
        'Por definir',   // region
        'Por definir',   // type
        'TBD',           // prize_1
        'TBD',           // prize_2
        'TBD',           // prize_3
        'Por definir'    // entry_fee
      ]
    );

    return NextResponse.json({ message: "Torneo creado con éxito" });
  } catch (error) {
    console.error("Error creando torneo:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}

// PUT: Actualizar Torneo
export async function PUT(request: Request) {
    if (!(await isAdmin())) return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    try {
        const data = await request.json();
        await pool.query(
            `UPDATE tournaments SET 
                bracket_data = ?, status = ?, banner_url = ?, format = ?, mode = ?, 
                slots = ?, region = ?, type = ?, prize_1 = ?, prize_2 = ?, prize_3 = ?, entry_fee = ?
            WHERE id = ?`,
            [
                JSON.stringify(data.bracket_data), data.status, data.banner_url, data.format, data.mode,
                data.slots, data.region, data.type, data.prize_1, data.prize_2, data.prize_3, data.entry_fee, data.id
            ]
        );
        return NextResponse.json({ message: "Actualizado correctamente" });
    } catch (error) {
        console.error("Error actualizando torneo:", error);
        return NextResponse.json({ message: "Error interno" }, { status: 500 });
    }
}