"use client";
import React, { useEffect, useState } from "react";
import TaskForm from "./form/task-form";
import TaskTable from "./table/task-table";

import axios from "axios";
import { getTasks } from "@/lib/db";
import { syncData } from "@/lib/sync";
import { cn } from "@/lib/utils";
import { CheckCircle2, Info } from "lucide-react";

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
        const syncSttatus = await syncData();

        // console.log(syncSttatus);

        await axios.get("/api/task").then(({ data }) => {
          setTasks(data);
        });
      } else {
        const data = await getTasks();
        setTasks(data.rows as Task[]);
      }
    } catch (error) {
      console.log("Error 1=>", error);
    }
  };

  return (
    <div className="grid grid-rows items-start justify-items-center min-h-screen pb-20 gap-16 ">
      <nav
        className={cn(
          "py-2 px-24 w-full flex justify-center",
          isOnline ? "bg-green-400" : "bg-amber-300"
        )}
      >
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="size-4 text-white" />
              <label
                htmlFor="airplane-mode"
                className="text-sm font-medium text-white"
              >
                Online
              </label>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              <Info className=" size-4 text-gray-800" />
              <label
                htmlFor="airplane-mode"
                className="text-sm font-medium text-gray-800"
              >
                Offline
              </label>
            </div>
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
        <div className="py-3 border-t w-full">
          <TaskTable tasks={tasks} loadTask={loadTask} isOnline={isOnline} />
        </div>
      </main>
    </div>
  );
};

export default ClientTask;
