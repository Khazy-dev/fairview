// API de usuarios. Endpoint: /api/usuarios
// POST { nombre, email } -> crea o actualiza la cuenta (login/registro)

export async function onRequestPost({ env, request }) {
  const { nombre, email } = await request.json();
  if (!nombre || !email) return Response.json({ error: "faltan datos" }, { status: 400 });
  await env.DB.prepare(
    `INSERT INTO usuarios (nombre, email) VALUES (?, ?)
     ON CONFLICT(email) DO UPDATE SET nombre = excluded.nombre`
  ).bind(nombre, email).run();
  return Response.json({ nombre, email });
}
