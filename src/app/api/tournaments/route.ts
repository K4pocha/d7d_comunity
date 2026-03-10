import { NextResponse } from "next/server";
import { pool } from "../../../lib/db"; // Asegúrate de que esta ruta coincida con tu db.ts

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM tournaments ORDER BY start_date DESC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ message: "Error al obtener torneos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // if (!(await isAdmin())) return NextResponse.json({ message: "No autorizado" }, { status: 403 });

  try {
    const data = await request.json();
    const { 
      title, game, start_date, format, max_slots, sponsor, 
      bracket_data, prizes = [] 
    } = data;
    
    const defaultBracket = bracket_data || {
        rounds: [
            { name: "Cuartos", matches: [ {p1:"TBD", p2:"TBD", s1:0, s2:0}, {p1:"TBD", p2:"TBD", s1:0, s2:0}, {p1:"TBD", p2:"TBD", s1:0, s2:0}, {p1:"TBD", p2:"TBD", s1:0, s2:0} ] },
            { name: "Semifinal", matches: [ {p1:"TBD", p2:"TBD", s1:0, s2:0}, {p1:"TBD", p2:"TBD", s1:0, s2:0} ] },
            { name: "Final", matches: [ {p1:"TBD", p2:"TBD", s1:0, s2:0} ] }
        ]
    };

    const formattedDate = start_date ? new Date(start_date) : new Date();

    await pool.query(
      `INSERT INTO tournaments 
      (title, game, start_date, status, format, max_slots, current_slots, sponsor, prizes, bracket_data) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, 
        game, 
        formattedDate, 
        "Inscripciones", 
        format || "BO1", 
        max_slots || 16, 
        0, 
        sponsor || "", 
        JSON.stringify(prizes), 
        JSON.stringify(defaultBracket)
      ]
    );

    return NextResponse.json({ message: "Torneo creado exitosamente" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
    try {
        const { id, bracket_data, status } = await request.json();
        await pool.query(
            "UPDATE tournaments SET bracket_data = ?, status = ? WHERE id = ?",
            [JSON.stringify(bracket_data), status, id]
        );
        return NextResponse.json({ message: "Torneo actualizado" });
    } catch (error) {
        return NextResponse.json({ message: "Error interno" }, { status: 500 });
    }
}