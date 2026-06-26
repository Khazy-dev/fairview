// API de favoritos ("Mi lista"). Endpoints: /api/favoritos
// GET    ?email=...                 -> lista los favoritos del usuario
// POST   { email, title, ... }      -> agrega un favorito (ignora si ya existe)
// DELETE ?email=...&title=...       -> quita un favorito

export async function onRequestGet({ env, request }) {
  const email = new URL(request.url).searchParams.get("email");
  if (!email) return Response.json({ error: "email requerido" }, { status: 400 });
  const { results } = await env.DB
    .prepare("SELECT * FROM favoritos WHERE email = ? ORDER BY id")
    .bind(email).all();
  return Response.json(results);
}

export async function onRequestPost({ env, request }) {
  const f = await request.json();
  if (!f.email || !f.title) return Response.json({ error: "faltan datos" }, { status: 400 });
  await env.DB.prepare(
    `INSERT INTO favoritos (email,title,author,isbn,img)
     VALUES (?,?,?,?,?)
     ON CONFLICT(email,title) DO NOTHING`
  ).bind(f.email, f.title, f.author, f.isbn, f.img).run();
  return Response.json({ ok: true });
}

export async function onRequestDelete({ env, request }) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const title = url.searchParams.get("title");
  if (!email || !title) return Response.json({ error: "faltan datos" }, { status: 400 });
  await env.DB.prepare("DELETE FROM favoritos WHERE email = ? AND title = ?")
    .bind(email, title).run();
  return Response.json({ ok: true });
}
