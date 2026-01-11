"use server";

export async function checkTwitchStatus(usernames: string[]) {
  try {
    // 1. Obtener Token
    // Nota: Aunque esto se hace en cada llamada, es rápido. 
    // La protección real está en la llamada del paso 2.
    const tokenResponse = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
      { 
        method: "POST",
        // Opcional: Cachear el token por 1 hora para no pedirlo a cada rato
        next: { revalidate: 3600 } 
      }
    );
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) return null;

    // 2. Consultar Twitch (AQUÍ ESTÁ EL ESCUDO DE SEGURIDAD 🛡️)
    const queryParams = usernames.map(u => `user_login=${u}`).join("&");
    
    const streamResponse = await fetch(
      `https://api.twitch.tv/helix/streams?${queryParams}`,
      {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID!,
          "Authorization": `Bearer ${accessToken}`,
        },
        // CAMBIO IMPORTANTE:
        // En lugar de 'no-store', usamos revalidate.
        // Esto guarda la respuesta por 120 segundos (2 minutos).
        next: { revalidate: 120 } 
      }
    );

    const streamData = await streamResponse.json();

    if (!streamData.data || streamData.data.length === 0) {
      return []; 
    }

    // 3. MAPEAR TODOS
    return streamData.data.map((stream: any) => ({
      id: stream.id,
      streamer: stream.user_name,
      game: stream.game_name,
      viewers: stream.viewer_count,
      thumbnail: stream.thumbnail_url.replace("{width}x{height}", "1280x720"),
      url: `https://twitch.tv/${stream.user_login}`
    }));

  } catch (error) {
    console.error("Error conectando con Twitch:", error);
    return [];
  }
}