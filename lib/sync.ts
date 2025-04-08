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
    // Get all offline changes
    const offlineTodos = await getTasks();

    let syncStatus = offlineTodos.rows.length;

    if (offlineTodos.rows.length > 0) {
      for (const todo of offlineTodos.rows) {
        // Push to online database
        await axios.post("/api/task", {
          title: todo.title,
          status: todo.status,
        });
        // Mark as synced in offline DB
        await deleteTask(todo.id);
      }
    } else {
      syncStatus = offlineTodos.rows.length;
    }

    // console.log("sync function=>", syncStatus);
    return syncStatus;
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

// Listen for online/offline events
// if (typeof window !== "undefined") {
//   window.addEventListener("online", syncData);
// }
