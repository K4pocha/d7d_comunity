import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db'; //
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Función auxiliar de Admin (reutilizada)
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("myTokenName");
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

// POST: Crear Torneo
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ message: "No autorizado" }, { status: 403 });

  try {
    const { title, game, start_date, bracket_data } = await request.json();
    
    // bracket_data por defecto si viene vacío (Estructura de 8 equipos ejemplo)
    const defaultBracket = bracket_data || {
        rounds: [
            { name: "Cuartos de Final", matches: [ {p1:"TBD", p2:"TBD", s1:0, s2:0}, {p1:"TBD", p2:"TBD", s1:0, s2:0}, {p1:"TBD", p2:"TBD", s1:0, s2:0}, {p1:"TBD", p2:"TBD", s1:0, s2:0} ] },
            { name: "Semifinal", matches: [ {p1:"TBD", p2:"TBD", s1:0, s2:0}, {p1:"TBD", p2:"TBD", s1:0, s2:0} ] },
            { name: "Gran Final", matches: [ {p1:"TBD", p2:"TBD", s1:0, s2:0} ] }
        ]
    };

    await pool.query(
      "INSERT INTO tournaments (title, game, start_date, bracket_data) VALUES (?, ?, ?, ?)",
      [title, game, start_date, JSON.stringify(defaultBracket)]
    );

    return NextResponse.json({ message: "Torneo creado" });
  } catch (error) {
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}

// PUT: Actualizar Torneo (Resultados)
export async function PUT(request: Request) {
    if (!(await isAdmin())) return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    try {
        const { id, bracket_data, status } = await request.json();
        await pool.query(
            "UPDATE tournaments SET bracket_data = ?, status = ? WHERE id = ?",
            [JSON.stringify(bracket_data), status, id]
        );
        return NextResponse.json({ message: "Actualizado" });
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}