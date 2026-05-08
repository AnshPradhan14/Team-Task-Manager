import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { NewTaskModal } from "@/components/kanban/NewTaskModal";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Kanban } from "lucide-react";

export default async function BoardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!currentUser) redirect("/auth/login");

  const isAdmin = currentUser.role === "ADMIN";

  let defaultProject = await prisma.project.findFirst();
  if (!defaultProject) {
    defaultProject = await prisma.project.create({
      data: { name: "Main Project", ownerId: currentUser.id },
    });
  }

  const tasks = await prisma.task.findMany({
    where: {
      projectId: defaultProject.id,
      ...(isAdmin ? {} : { assignedToUserId: currentUser.id }),
    },
    include: {
      assignedTo: {
        select: { id: true, name: true, designation: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 space-y-8 flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Kanban className="w-10 h-10 text-primary" />
            Project Board
          </h1>
          <p className="text-muted-foreground text-lg">
            {isAdmin 
              ? "Manage team assignments and track task progress visually." 
              : "View and update your assigned tasks across the board."}
          </p>
        </div>
        {isAdmin && <NewTaskModal projectId={defaultProject.id} />}
      </div>

      <div className="flex-1 min-h-0 bg-muted/20 rounded-2xl border border-dashed border-muted overflow-hidden">
        <KanbanBoard initialTasks={tasks as any} projectId={defaultProject.id} />
      </div>
    </div>
  );
}
