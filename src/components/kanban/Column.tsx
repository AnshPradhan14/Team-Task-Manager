import React, { useMemo } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";

interface AssignedUser {
  id: string;
  name: string;
  designation: string;
}

interface Task {
  id: number;
  projectId: string;
  title: string;
  status: string;
  priority: string;
  description?: string | null;
  assignedTo?: AssignedUser | null;
  assignedToUserId?: string | null;
}

interface ColumnProps {
  id: string;
  tasks: Task[];
}

const COLUMN_LABELS: Record<string, { label: string; color: string }> = {
  TODO: { label: "To Do", color: "bg-amber-500" },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-500" },
  DONE: { label: "Done", color: "bg-emerald-500" },
};

export function Column({ id, tasks }: ColumnProps) {
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "Column",
    },
  });

  const colInfo = COLUMN_LABELS[id] || { label: id, color: "bg-muted" };

  return (
    <div className={`flex flex-col gap-4 bg-muted/30 p-4 rounded-xl min-w-[300px] w-full max-w-[350px] transition-all duration-300 ${
      isOver ? "ring-2 ring-primary/40 bg-primary/5 shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-[1.01]" : ""
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${colInfo.color}`} />
          <h2 className="font-semibold text-sm">{colInfo.label}</h2>
        </div>
        <span className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full font-medium">
          {tasks.length}
        </span>
      </div>

      <div ref={setNodeRef} className="flex flex-col gap-3 min-h-[400px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground/50 border-2 border-dashed border-muted rounded-lg min-h-[100px]">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}
