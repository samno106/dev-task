"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task } from "@prisma/client";
import {
  CheckCircle2Icon,
  Loader,
  LoaderIcon,
  Pen,
  Trash,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
interface TaskProps {
  tasks: Task[];
}

export const TaskTable: React.FC<TaskProps> = ({ tasks }) => {
  const router = useRouter();

  async function onDeleteItem(id: number) {
    try {
      await axios.delete(`/api/task/${id}`);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Table>
      {tasks.length == 0 ? (
        <TableCaption>A list of your recent task.</TableCaption>
      ) : (
        ""
      )}

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
            <TableCell>{task.createdAt.toDateString()}</TableCell>
            <TableCell className="text-right">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDeleteItem(task.id)}
              >
                <Trash className=" size-3.5" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TaskTable;
