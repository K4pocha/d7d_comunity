"use server";

export async function checkTwitchStatus(usernames: string[]) {
  try {
    // 1. Obtener Token (Igual que siempre)
    const tokenResponse = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
      { method: "POST" }
    );
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) return null;

    // 2. Consultar Twitch
    const queryParams = usernames.map(u => `user_login=${u}`).join("&");
    const streamResponse = await fetch(
      `https://api.twitch.tv/helix/streams?${queryParams}`,
      {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID!,
          "Authorization": `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const streamData = await streamResponse.json();

    if (!streamData.data || streamData.data.length === 0) {
      return []; // Devolvemos array vacío en vez de null
    }

    // 3. MAPEAR TODOS (No solo el primero)
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