import * as SQLite from "expo-sqlite";
import { BookEntry } from "../types";

const db = SQLite.openDatabaseSync("bookjournal.db");

export function initDatabase(): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      isbn TEXT,
      title TEXT,
      author TEXT,
      coverUrl TEXT,
      localImageUri TEXT,
      notes TEXT,
      rating INTEGER
    );
  `);

  migrateLegacySingleBookSchemaIfNeeded();

  db.execSync(`CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date);`);
}

// Funkcja migracji dla starszej wersji bazy danych, która przechowywała tylko jeden wpis książki
function migrateLegacySingleBookSchemaIfNeeded(): void {
  const tableInfo = db.getAllSync<{ name: string }>(
    `PRAGMA table_info(entries);`,
  );
  const hasIdColumn = tableInfo.some((col) => col.name === "id");
  if (hasIdColumn) return; // Jeśli kolumna 'id' istnieje, to nie trzeba migrować

  db.execSync("ALTER TABLE entries RENAME TO entries_legacy;");
  db.execSync(`
    CREATE TABLE entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      isbn TEXT,
      title TEXT,
      author TEXT,
      coverUrl TEXT,
      localImageUri TEXT,
      notes TEXT,
      rating INTEGER
    );
  `);
  db.execSync(`
    INSERT INTO entries (date, isbn, title, author, coverUrl, localImageUri, notes, rating)
    SELECT date, isbn, title, author, coverUrl, localImageUri, notes, rating FROM entries_legacy;
  `);
  db.execSync("DROP TABLE entries_legacy;");
}

export function getAllEntries(): Record<string, BookEntry[]> {
  const rows = db.getAllSync<BookEntry>(
    "SELECT * FROM entries ORDER BY id ASC;",
  );
  const map: Record<string, BookEntry[]> = {};
  for (const row of rows) {
    if (!map[row.date]) {
      map[row.date] = [];
    }
    map[row.date].push(row);
  }
  return map;
}

export function getEntriesForDate(date: string): BookEntry[] {
  return db.getAllSync<BookEntry>(
    "SELECT * FROM entries WHERE date = ? ORDER BY id ASC;",
    [date],
  );
}

export function getEntryById(id: number): BookEntry | null {
  const row = db.getFirstSync<BookEntry>(
    "SELECT * FROM entries WHERE id = ?;",
    [id],
  );
  return row ?? null;
}

// Partial<BookEntry> + wymagane 'date'. Jeśli podane jest 'id', aktualizuje
// istniejący wpis; w przeciwnym razie tworzy nowy — dzięki temu jeden dzień
// może mieć wiele książek. Zwraca id zapisanego wpisu.
export function saveEntry(
  entry: Partial<BookEntry> & { date: string },
): number {
  const {
    id,
    date,
    isbn = null,
    title = null,
    author = null,
    coverUrl = null,
    localImageUri = null,
    notes = null,
    rating = null,
  } = entry;

  if (id != null) {
    db.runSync(
      `UPDATE entries SET
         date = ?,
          isbn = ?,
          title = ?,
          author = ?,
          coverUrl = ?,
          localImageUri = ?,
          notes = ?,
          rating = ?
        WHERE id = ?;`,
      [date, isbn, title, author, coverUrl, localImageUri, notes, rating, id],
    );
    return id;
  }

  const result = db.runSync(
    `INSERT INTO entries (date, isbn, title, author, coverUrl, localImageUri, notes, rating)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [date, isbn, title, author, coverUrl, localImageUri, notes, rating],
  );
  return result.lastInsertRowId;
}

export function deleteEntry(id: number): void {
  db.runSync("DELETE FROM entries WHERE id = ?;", [id]);
}

export function getCachedEntriesOlderThan(cutoffDate: string): BookEntry[] {
  return db.getAllSync<BookEntry>(
    `SELECT * FROM entries
     WHERE date < ?
       AND coverUrl IS NOT NULL
       AND localImageUri IS NOT NULL;`,
    [cutoffDate],
  );
}

export function clearLocalImagePath(id: number): void {
  db.runSync("UPDATE entries SET localImageUri = NULL WHERE id = ?;", [id]);
}

export function getLocalImageUrisNewerThan(cutoffDate: string): string[] {
  const rows = db.getAllSync<{ localImageUri: string }>(
    `SELECT DISTINCT localImageUri FROM entries
     WHERE date >= ? AND localImageUri IS NOT NULL;`,
    [cutoffDate],
  );
  return rows.map((r) => r.localImageUri);
}
