"use client";
import React, { useEffect, useState } from "react";
import TaskForm from "./form/task-form";
import TaskTable from "./table/task-table";

import axios from "axios";
import { getTasks } from "@/lib/db";
import { syncData } from "@/lib/sync";

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

        syncData();

      } else {
        const data = await getTasks();
        setTasks(data.rows as Task[]);
      }
    } catch (error) {

      console.log("Error 1=>",error);
    }
  };



  return (
    <div className="grid grid-rows items-center justify-items-center min-h-screen px-8 pb-20 gap-16 ">
      <nav className="py-3 px-24 w-full flex justify-center">
        <div className="flex items-center space-x-2">
          {isOnline ? (
          <div className="flex items-center space-x-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4.5 text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>

              <label
              htmlFor="airplane-mode"
              className="text-sm font-medium text-green-500"
            >
              Online
            </label>
          </div>
          ) : (
           <div className="flex items-center space-x-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4.5 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <label
                htmlFor="airplane-mode"
                className="text-sm font-medium text-gray-500"
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
        <div className="py-3 border-t">
          <TaskTable tasks={tasks} loadTask={loadTask} isOnline={isOnline} />
        </div>
      </main>
    </div>
  );
};

export default ClientTask;
