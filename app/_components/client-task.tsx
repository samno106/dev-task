"use client";

import { Switch } from "@/components/ui/switch";
import React, { useState } from "react";
import TaskForm from "./task-form";
import TaskTable from "./task-table";
import { Task } from "@prisma/client";

interface TaskProps {
  tasks: Task[];
}

export const ClientTask: React.FC<TaskProps> = ({ tasks }) => {
  const [onlineMode, setOnlineMod] = useState(true);

  const onSetMode = () => {
    setOnlineMod(!onlineMode);
  };

  return (
    <div className="grid grid-rows items-center justify-items-center min-h-screen px-8 pb-20 gap-16 ">
      <nav className="py-3 px-24 w-full flex justify-end">
        <div className="flex items-center space-x-2">
          <Switch
            id="airplane-mode"
            checked={onlineMode}
            onCheckedChange={onSetMode}
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
            <TaskForm />
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
