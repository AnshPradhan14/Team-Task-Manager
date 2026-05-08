import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { 
  CheckCircle2, 
  Clock, 
  Kanban,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MyTasksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      tasks: {
        orderBy: { updatedAt: "desc" }
      }
    }
  });

  if (!currentUser) redirect("/auth/login");

  const activeTasks = currentUser.tasks.filter(t => t.status !== "DONE");
  const completedTasks = currentUser.tasks.filter(t => t.status === "DONE");

  return (
    <div className="p-8 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
            <Kanban className="w-10 h-10 text-primary" />
            My Tasks
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your personal progress and manage assigned responsibilities.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 px-6 py-3 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-center gap-3">
            <Clock className="text-blue-600" size={24} />
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active</p>
              <p className="text-xl font-black text-blue-700 dark:text-blue-400">{activeTasks.length}</p>
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/20 px-6 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={24} />
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Completed</p>
              <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">{completedTasks.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Active Tasks Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b pb-4">
            <Clock className="text-primary" size={20} />
            <h2 className="text-2xl font-bold">Active Work</h2>
          </div>
          
          <div className="space-y-4">
            {activeTasks.length === 0 ? (
              <div className="p-12 text-center bg-muted/20 rounded-3xl border border-dashed">
                <p className="text-muted-foreground font-medium">No active tasks. Take a break! ☕</p>
              </div>
            ) : (
              activeTasks.map(task => (
                <TaskListItem key={task.id} task={task} />
              ))
            )}
          </div>
        </section>

        {/* Completed Tasks Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b pb-4">
            <CheckCircle2 className="text-emerald-500" size={20} />
            <h2 className="text-2xl font-bold">Recently Done</h2>
          </div>
          
          <div className="space-y-4">
             {completedTasks.length === 0 ? (
              <div className="p-12 text-center bg-muted/20 rounded-3xl border border-dashed">
                <p className="text-muted-foreground font-medium">No completed tasks yet. Let's get moving!</p>
              </div>
            ) : (
              completedTasks.map(task => (
                <TaskListItem key={task.id} task={task} isCompleted />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function TaskListItem({ task, isCompleted }: { task: any, isCompleted?: boolean }) {
  return (
    <Card className={`group overflow-hidden border-muted hover:shadow-lg transition-all duration-300 ${isCompleted ? 'opacity-75 grayscale-[0.5]' : ''}`}>
      <CardContent className="p-0">
        <div className="flex items-center gap-4 p-5">
          <div className={`w-2 h-12 rounded-full ${
            task.priority === "HIGH" ? "bg-red-500" : task.priority === "MEDIUM" ? "bg-amber-500" : "bg-emerald-500"
          }`} />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                task.priority === "HIGH" ? "bg-red-100 text-red-700" : task.priority === "MEDIUM" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
              }`}>
                {task.priority}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                <Calendar size={10} />
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              </span>
            </div>
            <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{task.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{task.description || 'No description provided.'}</p>
          </div>

          <div className="text-right shrink-0">
            <div className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
              task.status === "DONE" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
            }`}>
              {task.status}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
