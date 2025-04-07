"use client";

import { Switch } from "@/components/ui/switch";
import React, { useEffect, useState } from "react";
import TaskForm from "./form/task-form";
import TaskTable from "./table/task-table";
import { PGlite } from "@electric-sql/pglite";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Task {
  id: number;
  title: string;
  status: string;
  created: string;
}

export const ClientTask = () => {

  const [tasks, setTasks] = useState<Task[] | unknown>([]);

  const [onlineMode, setOnlineMod] = useState(true);


  async function getRecordOnline(){
      console.log(onlineMode)
    if(onlineMode){
      await axios.get("/api/task").then(({data})=>{
        setTasks(data);
      });
    }else{

      const db = new PGlite("idb://task-db");
      const result = await db.query(`SELECT * FROM task;`);
      setTasks(result.rows);

    }
   

  }

  async function getRecordOffline(){
    const db = new PGlite("idb://task-db");
    const result = await db.query(`SELECT * FROM task;`);
    setTasks(result.rows);
  }

  async function initializeDB() {

    const db = new PGlite("idb://task-db");

    await db.query(
      `CREATE TABLE IF NOT EXISTS task (id SERIAL PRIMARY KEY, title VARCHAR(255), status VARCHAR(255), created TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`
    );

  }

  useEffect(() => {

    setOnlineMod(navigator.onLine);

    window.addEventListener("online", () => {
      setOnlineMod(true);
    });
    window.addEventListener("offline", () => {
      setOnlineMod(false);

    });

    initializeDB();

    getRecordOnline();   

    // return () => {
    //   window.removeEventListener("online", () => {
    //     setOnlineMod(true);
    //     router.refresh();
    //   });
    //   window.removeEventListener("offline", () => {
    //     setOnlineMod(false);
    //     router.refresh();
    //   });
    // };
  }, []);

  return (
    <div className="grid grid-rows items-center justify-items-center min-h-screen px-8 pb-20 gap-16 ">
      <nav className="py-3 px-24 w-full flex justify-end">
        <div className="flex items-center space-x-2">
          <Switch
            id="airplane-mode"
            checked={onlineMode}
         
          />
          {onlineMode ? (
            <label
              htmlFor="airplane-mode"
              className="text-sm font-medium text-green-500"
            >
              Online
            </label>
          ) : (
            <label
              htmlFor="airplane-mode"
              className="text-sm font-medium text-gray-500"
            >
              Offline
            </label>
          )}
        </div>
      </nav>
      <main className="flex flex-col gap-[32px]   items-start">
        <div className=" w-full">
          <h2 className="text-2xl font-semibold text-gray-700 text-center w-full ">
            Dev Task
          </h2>
          <div className=" py-5 rounded-lg mt-2 w-full  flex justify-center">
            <TaskForm onlineMode={onlineMode} setTasks={setTasks} />
          </div>
        </div>
        <div className="py-3 border-t">
          <TaskTable tasks={tasks} />
        </div>
      </main>
    </div>
  );
};

export default ClientTask;
