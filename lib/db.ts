import { PGlite } from "@electric-sql/pglite";

// Offline client (initialized when needed)
let pglite: PGlite | null = null;
let offlineInitialized = false;

async function getOfflineDb(): Promise<PGlite> {
  if (!pglite) {
    pglite = new PGlite("idb://task-db");
    offlineInitialized = false;
  }

  if (!offlineInitialized) {
    // Initialize your schema here
    await pglite.query(
      `CREATE TABLE IF NOT EXISTS task (id SERIAL PRIMARY KEY, title VARCHAR(255), status VARCHAR(255), created TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`
    );
    offlineInitialized = true;
  }

  return pglite;
}

export async function query(
  sql: string,
  params?: any[],
  online: boolean = navigator.onLine
) {
  try {
    const db = await getOfflineDb();
    return await db.query(sql, params);
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

// Add more specific methods as needed
export async function getTasks(online: boolean = navigator.onLine) {
  return query("SELECT * FROM task ORDER BY created DESC", [], online);
}
