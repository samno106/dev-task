"use client";
import { Button } from "@/components/ui/button";
import { Loader, Trash } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { PGlite } from "@electric-sql/pglite";
import { deleteTask } from "@/lib/db";

interface TaskId {
  id: number;
  loadTask: () => void;
  isOnline: boolean;
}

export const DeleteButton: React.FC<TaskId> = ({ id, loadTask, isOnline }) => {
  const [loading, setLoading] = useState(false);

  async function onDeleteItem(id: string) {
    setLoading(true);
    try {
      if (isOnline) {
        await axios.delete(`/api/task/${id}`);
      } else {
        await deleteTask(parseInt(id, 10));
      }

      setLoading(false);
      loadTask();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  return (
    <Button
      size="icon"
      variant="ghost"
      className="cursor-pointer"
      onClick={() => onDeleteItem(id.toString())}
    >
      {loading ? (
        <Loader className=" size-3.5 animate-spin" />
      ) : (
        <Trash className=" size-3.5" />
      )}
    </Button>
  );
};

export default DeleteButton;
