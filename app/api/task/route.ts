import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export async function GET(req: Request) {
  try {
    const task = await prismadb.task.findMany();

    await prismadb.$disconnect();
    return Response.json(task);
  } catch (error) {
    console.log("Submit error", error);
    return new Response("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, status } = body;

    if (!title) {
      return new Response("Title is required", { status: 400 });
    }

    if (!status) {
      return new Response("Status is required", { status: 400 });
    }

    const task = await prismadb.task.create({
      data: {
        title,
        status,
      },
    });
    revalidatePath("/");
    await prismadb.$disconnect();
    return Response.json(task);
  } catch (error) {
    console.log("Submit error", error);
    return new Response("Internal error", { status: 500 });
  }
}
