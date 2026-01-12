import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // 1. Recibimos los datos (aunque no los guardemos)
  const body = await request.json();
  const { nickname, email, password } = body;

  console.log("📝 Datos recibidos en modo UI:", { nickname, email, password });

  // 2. SIMULAMOS una espera de 2 segundos (para ver la animación de carga)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 3. (Opcional) Simular un error para probar tu alerta roja
  // Si quieres ver cómo se ve el error, descomenta estas 3 líneas:
  /*
  if (nickname === "Error") {
    return NextResponse.json({ message: "El usuario ya existe (Prueba de UI)" }, { status: 409 });
  }
  */

  // 4. Devolver éxito (Esto arregla el error de JSON.parse)
  return NextResponse.json(
    { 
      id: 1, 
      nickname, 
      email, 
      role: "USER" 
    }, 
    { status: 201 }
  );
}