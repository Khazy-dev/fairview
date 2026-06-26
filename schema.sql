-- Esquema de la base de datos D1 (Cloudflare) para FairView.
-- Ejecutar una sola vez:
--   npx wrangler d1 execute fairview-db --file=schema.sql

CREATE TABLE IF NOT EXISTS usuarios (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email  TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS reservas (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  email    TEXT NOT NULL,
  title    TEXT NOT NULL,
  author   TEXT,
  isbn     TEXT,
  img      TEXT,
  date     TEXT,
  entrega  TEXT,
  sucursal TEXT,
  folio    TEXT,
  UNIQUE(email, title)            -- un mismo usuario no repite el mismo libro
);

CREATE TABLE IF NOT EXISTS favoritos (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  email  TEXT NOT NULL,
  title  TEXT NOT NULL,
  author TEXT,
  isbn   TEXT,
  img    TEXT,
  UNIQUE(email, title)
);
