import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const task = await prismadb.task.deleteMany({
      where: {
        id: parseInt(id, 10),
      },
    });
    revalidatePath("/");
    await prismadb.$disconnect();
    return Response.json(task);
  } catch (error) {
    console.log("[TASK DELETE]", error);
    return new Response("Internal error", { status: 500 });
  }
}
