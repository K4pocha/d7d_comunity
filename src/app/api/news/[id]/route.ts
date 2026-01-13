import { NextResponse } from "next/server";
import { pool } from "../../../../lib/db";

export async function GET(
  request: Request,
  // Desestructuramos 'params' directamente y le decimos que es una Promesa
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Esperamos a que la promesa de params se resuelva
    const { id } = await params;

    // 2. Consulta a la Base de Datos
    const [rows]: any = await pool.query(
      `SELECT news.*, user.nickname as author_name, user.avatar as author_avatar 
       FROM news 
       LEFT JOIN user ON news.author_id = user.id 
       WHERE news.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Noticia no encontrada" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);

  } catch (error) {
    console.error("Error API News ID:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}