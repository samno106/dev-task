import { prismadb } from "@/lib/prismadb";

type DeleteParams = {
  params: {
    id: string;
  };
};

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = params;

    const task = await prismadb.task.deleteMany({
      where: {
        id: parseInt(id.toString(), 10),
      },
    });

    await prismadb.$disconnect();
    return Response.json(task);
  } catch (error) {
    console.log("[TASK DELETE]", error);
    return new Response("Internal error", { status: 500 });
  }
}
