import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { 
  Shield, 
  User, 
  ArrowRight, 
  Kanban, 
  Users as UsersIcon,
  Sparkles
} from "lucide-react";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!currentUser) {
    redirect("/auth/login");
  }

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

  const now = new Date();
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "DONE").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    overdue: tasks.filter((t) => t.status !== "DONE" && t.dueDate && new Date(t.dueDate) < now).length,
  };

  const statusData = [
    { name: "TODO", value: tasks.filter((t) => t.status === "TODO").length },
    { name: "IN_PROGRESS", value: stats.inProgress },
    { name: "DONE", value: stats.completed },
  ];

  const productivityData = isAdmin
    ? await prisma.user
        .findMany({
          where: { role: "MEMBER" },
          select: {
            name: true,
            tasks: {
              where: {
                status: "DONE",
                projectId: defaultProject.id,
              },
            },
          },
        })
        .then((users) =>
          users
            .map((u) => ({
              userName: u.name,
              completed: u.tasks.length,
            }))
            .filter((u) => u.completed > 0)
        )
    : [];

  return (
    <main className="p-8 space-y-12">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-indigo-700 p-8 text-primary-foreground shadow-2xl shadow-primary/20">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} />
              Good Day, {currentUser.name.split(" ")[0]}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Project Performance <br /> Dashboard
            </h1>
            <p className="text-primary-foreground/70 max-w-md">
              {isAdmin 
                ? "Manage your team's workload and monitor task health in one centralized place." 
                : "You have " + stats.inProgress + " active tasks and " + stats.overdue + " overdue items to address today."}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/board">
                <Button variant="secondary" className="gap-2 font-bold group shadow-lg">
                  <Kanban size={18} className="group-hover:rotate-12 transition-transform" />
                  View Board
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/team">
                <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 gap-2 font-bold">
                  <UsersIcon size={18} />
                  Team Stats
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center justify-center w-64 h-64 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20 shadow-inner">
             <div className="text-center">
               <div className="text-5xl font-black mb-1">{stats.total}</div>
               <div className="text-xs font-bold uppercase tracking-widest opacity-60">Total Tasks</div>
             </div>
          </div>
        </div>

        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      {/* Dashboard Insights - Only for Admin */}
      {isAdmin && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-1">Team Insights</h2>
            <p className="text-muted-foreground">Detailed breakdown of project progress and team output.</p>
          </div>
          <DashboardOverview
            statusData={statusData}
            productivityData={productivityData}
            stats={stats}
          />
        </div>
      )}

      {/* Admin specific feed or User's recent activity */}
      <ActivityFeed projectId={defaultProject.id} />
    </main>
  );
}

