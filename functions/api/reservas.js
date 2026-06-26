// API de reservas. Endpoints: /api/reservas
// GET    ?email=...                 -> lista las reservas del usuario
// POST   { email, title, ... }      -> crea o actualiza (upsert) una reserva
// DELETE ?email=...&title=...       -> elimina una reserva

export async function onRequestGet({ env, request }) {
  const email = new URL(request.url).searchParams.get("email");
  if (!email) return Response.json({ error: "email requerido" }, { status: 400 });
  const { results } = await env.DB
    .prepare("SELECT * FROM reservas WHERE email = ? ORDER BY id")
    .bind(email).all();
  return Response.json(results);
}

export async function onRequestPost({ env, request }) {
  const r = await request.json();
  if (!r.email || !r.title) return Response.json({ error: "faltan datos" }, { status: 400 });

  // Validación de servidor: máximo 6 libros distintos por usuario
  const { results } = await env.DB
    .prepare("SELECT title FROM reservas WHERE email = ?").bind(r.email).all();
  const yaExiste = results.some(x => x.title === r.title);
  if (!yaExiste && results.length >= 6)
    return Response.json({ error: "Máximo 6 reservas" }, { status: 409 });

  await env.DB.prepare(
    `INSERT INTO reservas (email,title,author,isbn,img,date,entrega,sucursal,folio)
     VALUES (?,?,?,?,?,?,?,?,?)
     ON CONFLICT(email,title) DO UPDATE SET
       author=excluded.author, isbn=excluded.isbn, img=excluded.img,
       date=excluded.date, entrega=excluded.entrega,
       sucursal=excluded.sucursal, folio=excluded.folio`
  ).bind(r.email, r.title, r.author, r.isbn, r.img, r.date, r.entrega, r.sucursal, r.folio).run();

  return Response.json({ ok: true });
}

export async function onRequestDelete({ env, request }) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const title = url.searchParams.get("title");
  if (!email || !title) return Response.json({ error: "faltan datos" }, { status: 400 });
  await env.DB.prepare("DELETE FROM reservas WHERE email = ? AND title = ?")
    .bind(email, title).run();
  return Response.json({ ok: true });
}
