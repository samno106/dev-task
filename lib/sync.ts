// lib/sync.ts

import { PGlite } from "@electric-sql/pglite";
import axios from "axios";
import { deleteTask, getTasks } from "./db";
interface Task {
  id: number;
  title: string;
  status: string;
  created: string;
}

export async function syncData() {
  if (!navigator.onLine) return;
  try {
    console.log("Data start sync...");
  
    // Get all offline changes
    const offlineTodos = await getTasks();

    if(offlineTodos){
      for (const todo of offlineTodos.rows) {
        // Push to online database
        await axios.post("/api/task", { title: todo.title, status: todo.status });
        // Mark as synced in offline DB
        await deleteTask(todo.id);
      }
    }
   
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

// Listen for online/offline events
// if (typeof window !== "undefined") {
//   window.addEventListener("online", syncData);
// }
