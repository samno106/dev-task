"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader, Plus } from "lucide-react";
import { PGlite } from "@electric-sql/pglite";
import { addTask } from "@/lib/db";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  status: z.string().min(2, {
    message: "Staus must be at least 2 characters.",
  }),
});

interface OnlineModeProps {
  isOnline: boolean;
  loadTask: () => void;
}

export const TaskForm: React.FC<OnlineModeProps> = ({ isOnline, loadTask }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      status: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const db = new PGlite("idb://task-db");

    try {
      setLoading(true);
      if (isOnline) {
        await axios.post("/api/task", values);
      } else {
        await addTask(values.title,values.status)
      }
      loadTask();
      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-3">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="My first task..."
                  {...field}
                  className="w-72"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Cancel">Cancel</SelectItem>
                  <SelectItem value="Success">Success</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full uppercase mt-5 cursor-pointer">
          <span>Add new</span>
          {loading ? (
            <Loader className="size-4 animate-spin" />
          ) : (
            <Plus className=" size-4" />
          )}
        </Button>
      </form>
    </Form>
  );
};

export default TaskForm;
