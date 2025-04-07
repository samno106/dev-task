import { useEffect, useState } from "react";
import ClientTask from "./_components/client-task";
import { PGlite } from "@electric-sql/pglite";

interface Task {
  id: number;
  title: string;
  status: string;
  created: string;
}

export default async function Home() {
  return (
    <>
      <ClientTask />
    </>
  );
}
