"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2Icon, Loader, LoaderIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DeleteButton from "./_components/delete-button";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PGlite } from "@electric-sql/pglite";

interface Task {
  id: number;
  title: string;
  status: string;
  created: string;
}

interface TaskProps {
  tasks: Task[];
  loadTask: () => void;
  isOnline: boolean;
}
export const TaskTable: React.FC<TaskProps> = ({
  tasks,
  loadTask,
  isOnline,
}) => {
  return (
    <div className="w-full">
      {tasks.length == 0 ? (
        isOnline ? (
          <div className=" flex justify-center py-2 items-center">
            <Loader className=" animate-spin size-5" />
          </div>
        ) : (
          ""
        )
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
                  >
                    {task.status === "Success" ? (
                      <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
                    ) : task.status === "Cancel" ? (
                      <X className="text-red-500 dark:text-red-400" />
                    ) : (
                      <LoaderIcon className="text-blue-500 dark:text-blue-400" />
                    )}
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>{/* {task.createdAt.toDateString()} */}</TableCell>
                <TableCell className="text-right">
                  <DeleteButton
                    id={task.id}
                    loadTask={loadTask}
                    isOnline={isOnline}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TaskTable;
