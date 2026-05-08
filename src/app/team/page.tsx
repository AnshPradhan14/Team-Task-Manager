import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { 
  Users, 
  Shield, 
  User as UserIcon, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function TeamPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all users with their task stats
  const users = await prisma.user.findMany({
    include: {
      tasks: true,
      completedTasks: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Users className="w-10 h-10 text-primary" />
          Team Management
        </h1>
        <p className="text-muted-foreground text-lg">
          View all team members and monitor their overall performance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.map((user) => {
          const totalTasks = user.tasks.length;
          const completedTasks = user.tasks.filter(t => t.status === "DONE").length;
          const inProgressTasks = user.tasks.filter(t => t.status === "IN_PROGRESS").length;
          const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          return (
            <Card key={user.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-muted">
              <CardHeader className="pb-4 bg-muted/30 relative">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform shrink-0">
                    {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors leading-tight">{user.name}</CardTitle>
                    <div className="flex flex-col gap-1.5 mt-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {user.role === "ADMIN" ? (
                          <Shield size={12} className="text-amber-500" />
                        ) : (
                          <UserIcon size={12} />
                        )}
                        <span className="font-bold uppercase tracking-wider">{user.role}</span>
                      </div>
                      <div className="inline-flex w-fit bg-primary/10 text-primary text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                        {user.designation}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-4">
                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="text-primary">{completionRate}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000" 
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Done</span>
                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{completedTasks}</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/30 flex items-center gap-2">
                    <Clock size={16} className="text-blue-600" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Active</span>
                      <span className="text-sm font-bold text-blue-700 dark:text-blue-400">{inProgressTasks}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="pt-4 border-t border-muted flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  <span className="flex items-center gap-1">
                    <TrendingUp size={12} />
                    {totalTasks} Total Tasks
                  </span>
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
