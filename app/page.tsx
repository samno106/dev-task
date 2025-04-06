import { prismadb } from "@/lib/prismadb";
import ClientTask from "./_components/client-task";

export default async function Home() {
  const tasks = await prismadb.task.findMany();

  return (
    <>
      <ClientTask tasks={tasks} />
    </>
  );
}
