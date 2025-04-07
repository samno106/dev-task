"use client";
import { Button } from "@/components/ui/button"
import { Loader, Trash } from "lucide-react"
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface TaskId{
    id:number
}

export const DeleteButton:React.FC<TaskId> =({id})=>{
    const [loading,setLoading] =useState(false)
    const router = useRouter();

    async function onDeleteItem(id: number) {
      setLoading(true)
      try {
        await axios.delete(`/api/task/${id}`);
        router.refresh();
        setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
    }
    return(
        <Button
        size="icon"
        variant="ghost"
        className="cursor-pointer"
        onClick={() => onDeleteItem(id)}
        >
         {
            loading ? <Loader className=" size-3.5 animate-spin"/>:<Trash className=" size-3.5" />
         }
        
        </Button>
    )
}

export default DeleteButton