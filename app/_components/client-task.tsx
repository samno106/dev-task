"use client";

import { Switch } from "@/components/ui/switch";
import React, { useEffect, useState } from "react";
import TaskForm from "./form/task-form";
import TaskTable from "./table/task-table";
import { PGlite } from "@electric-sql/pglite";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getTasks } from "@/lib/db";

interface Task {
  id: number;
  title: string;
  status: string;
  created: string;
}

export const ClientTask = () => {
  const [isOnline, setIsOnline] = useState(true);

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    loadTask();
  }, [isOnline]);

  const loadTask = async () => {
    try {
      if (isOnline) {
        await axios.get("/api/task").then(({ data }) => {
          setTasks(data);
        });
      } else {
        const data = await getTasks(isOnline);
        setTasks(data.rows as Task[]);
      }
    } catch (error) {}
  };

  return (
    <div className="grid grid-rows items-center justify-items-center min-h-screen px-8 pb-20 gap-16 ">
      <nav className="py-3 px-24 w-full flex justify-end">
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" checked={isOnline} />
          {isOnline ? (
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
            <TaskForm isOnline={isOnline} loadTask={loadTask} />
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
