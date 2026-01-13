import { NextResponse } from "next/server";
import { pool } from "../../../lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// 1. CAMBIO AQUÍ: La función ahora es 'async'
async function getUserId() {
    // 2. CAMBIO AQUÍ: Agregamos 'await' a cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get("myTokenName");

    if (!token) return null;

    try {
        const decoded: any = jwt.verify(token.value, "secret-key-super-segura");
        return decoded.id;
    } catch (error) {
        return null;
    }
}

// 1. OBTENER PERFIL (GET)
export async function GET() {
    // 3. CAMBIO AQUÍ: Agregamos 'await' al llamar a la función auxiliar
    const userId = await getUserId();

    if (!userId) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

    try {
        const [rows]: any = await pool.query(
            "SELECT nickname, email, avatar, role, bio, cpu, gpu, ram, mouse, monitor, createdAt, real_name, birthdate, gender, country, discord_id, discord_username, steam_id, steam_username FROM User WHERE id = ?",
            [userId]
        );

        if (rows.length === 0) return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error interno" }, { status: 500 });
    }
}

// 2. ACTUALIZAR PERFIL (PUT)
export async function PUT(request: Request) {
    // 3. CAMBIO AQUÍ: Agregamos 'await' también
    const userId = await getUserId();

    if (!userId) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

    try {
        const data = await request.json();

        // Actualizamos solo los campos permitidos
        await pool.query(
            `UPDATE User SET 
        bio = ?, 
        cpu = ?, 
        gpu = ?, 
        ram = ?, 
        mouse = ?, 
        monitor = ?,
        real_name = ?,
        birthdate = ?,
        gender = ?,
        country = ?
       WHERE id = ?`,
            [
                data.bio, data.cpu, data.gpu, data.ram, data.mouse, data.monitor,
                data.real_name, data.birthdate, data.gender, data.country,
                userId
            ]
        );

        return NextResponse.json({ message: "Perfil actualizado correctamente" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error al actualizar" }, { status: 500 });
    }
}