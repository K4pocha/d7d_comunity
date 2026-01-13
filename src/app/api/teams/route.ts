import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';

// GET: Obtener todos los equipos
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM games ORDER BY id ASC');
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Editar un equipo (Admin)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, slug, status, description, image_url } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    await pool.query(
      'UPDATE games SET name=?, slug=?, status=?, description=?, image_url=? WHERE id=?',
      [name, slug, status, description, image_url, id]
    );

    return NextResponse.json({ success: true, message: 'Equipo actualizado' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}