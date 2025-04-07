import { prismadb } from "@/lib/prismadb";
import ClientTask from "./_components/client-task";

export default async function Home() {

  return (
    <>
      <ClientTask />
    </>
  );
}
