import { PGlite } from "@electric-sql/pglite";

let db: PGlite;

async function getDB() {
  if (!db) {
    db = new PGlite("idb://task-db", {
      relaxedDurability: true,
    });

    await initSchema(db);
  }

  return db;
}

async function initSchema(db: PGlite) {
  await db.query(
    `CREATE TABLE IF NOT EXISTS task (id SERIAL PRIMARY KEY, title VARCHAR(255), status VARCHAR(255), createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`
  );

  // await db.query(`DROP TABLE task;`);
}

export async function query(sql: string, params?: any[]) {
  try {
    const db = await getDB();
    return await db.query(sql, params);
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

// Add more specific methods as needed
export async function getTasks() {
  return query("SELECT * FROM task ORDER BY createdat DESC", []);
}

export async function addTask(title: string, status: string) {
  return query("INSERT INTO task (title, status) VALUES ($1,$2);", [
    title,
    status,
  ]);
}

export async function deleteTask(id: number) {
  return query("DELETE FROM task WHERE id=$1;", [id]);
}
