// app/api/users/[id]/route.ts
import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params:Promise<{ id: string }> }
) {
  try {

    const id = (await params).id;

    const user = await prismadb.task.delete({
      where: { id: parseInt(id, 10) },
    });

    if (!user) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
