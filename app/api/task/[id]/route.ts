import { prismadb } from "@/lib/prismadb";

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { id: number };
  }
) {
  try {
    const positions = await prismadb.task.deleteMany({
      where: {
        id: parseInt(params.id.toString()),
      },
    });
    await prismadb.$disconnect();
    return Response.json(positions);
  } catch (error) {
    console.log("[TASK DELETE]", error);
    return new Response("Internal error", { status: 500 });
  }
}
