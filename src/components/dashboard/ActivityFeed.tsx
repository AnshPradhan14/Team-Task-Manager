"use client";

import { useQuery } from "@tanstack/react-query";
import { getTaskActivity } from "@/actions/task";
import { 
  CheckCircle2, 
  ArrowRight, 
  UserPlus, 
  AlertTriangle, 
  Zap,
  Clock
} from "lucide-react";

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

interface ActivityItemProps {
  task: any;
}

function ActivityItem({ task }: ActivityItemProps) {
  const isDone = task.status === "DONE";
  const isInProgress = task.status === "IN_PROGRESS";
  const isTodo = task.status === "TODO";
  
  let icon = <ArrowRight size={18} />;
  let colorClass = "text-blue-500 bg-blue-500/10";
  let borderClass = "border-l-blue-500";
  let actionText = `moved to ${task.status}`;

  if (isDone) {
    icon = <CheckCircle2 size={18} />;
    colorClass = "text-emerald-500 bg-emerald-500/10";
    borderClass = "border-l-emerald-500";
    actionText = "completed this task";
  } else if (task.assignedTo && task.createdAt === task.updatedAt) {
    icon = <UserPlus size={18} />;
    colorClass = "text-amber-500 bg-amber-500/10";
    borderClass = "border-l-amber-500";
    actionText = `assigned to ${task.assignedTo.name}`;
  } else if (task.dueDate && new Date(task.dueDate) < new Date() && !isDone) {
    icon = <AlertTriangle size={18} />;
    colorClass = "text-red-500 bg-red-500/10";
    borderClass = "border-l-red-500";
    actionText = "is now overdue";
  }

  return (
    <div className={`flex items-center gap-4 p-4 bg-card rounded-2xl border border-border/50 border-l-[3px] ${borderClass} animate-in fade-in slide-in-from-top-4 duration-500`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-bold">{task.completedBy?.name || task.assignedTo?.name || "System"}</span>
          {" "}{actionText}{" "}
          <span className="font-bold text-primary">[{task.title}]</span>
        </p>
        <div className="flex items-center gap-1.5 mt-1 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
          <Clock size={10} />
          {timeAgo(new Date(task.updatedAt))}
        </div>
      </div>

      <div className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${
        isDone ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
        isInProgress ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
        "bg-slate-500/10 text-slate-600 border-slate-500/20"
      }`}>
        {task.status}
      </div>
    </div>
  );
}

export function ActivityFeed({ projectId }: { projectId: string }) {
  const { data: activity, isLoading } = useQuery({
    queryKey: ["taskActivity", projectId],
    queryFn: () => getTaskActivity(projectId),
    refetchInterval: 5000, // Poll every 5 seconds
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Live Activity</h2>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] font-black tracking-widest uppercase border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Real-time team task events and updates.</p>
        </div>
        
        <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
          View Full History →
        </button>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-hidden relative">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
             <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
             <p className="text-xs font-bold uppercase tracking-widest">Syncing activity...</p>
          </div>
        ) : activity?.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground/30">
              <Zap size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">No activity yet</p>
              <p className="text-xs text-muted-foreground">Tasks will appear here as your team works.</p>
            </div>
          </div>
        ) : (
          <>
            {activity?.map((task: any) => (
              <ActivityItem key={task.id} task={task} />
            ))}
            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          </>
        )}
      </div>
    </div>
  );
}
