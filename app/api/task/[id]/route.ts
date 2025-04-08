import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(await params?.id, 10);

    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), {
        status: 400,
      });
    }
    const positions = await prismadb.task.deleteMany({
      where: {
        id: id,
      },
    });
    revalidatePath("/");
    await prismadb.$disconnect();
    return Response.json(positions);
  } catch (error) {
    console.log("[TASK DELETE]", error);
    return new Response("Internal error", { status: 500 });
  }
}
