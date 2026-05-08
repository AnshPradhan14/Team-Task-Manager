"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, User, Edit2, Calendar } from "lucide-react";
import { deleteTask } from "@/actions/task";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { EditTaskModal } from "./EditTaskModal";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  dueDate?: Date | string | null;
  assignedTo?: AssignedUser | null;
  assignedToUserId?: string | null;
}

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

// ─── Priority Config ──────────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  HIGH: {
    bar: "#EF4444",
    badge: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400",
  },
  MEDIUM: {
    bar: "#F59E0B",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
  },
  LOW: {
    bar: "#10B981",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",
  },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const isAdmin = session?.user?.role === "ADMIN";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // ── Drag placeholder ────────────────────────────────────────────────────────
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={{ ...style, height: "120px" }}
        className="rounded-xl border-2 border-dashed border-primary/40 bg-primary/5"
      />
    );
  }

  // ── Derived values ──────────────────────────────────────────────────────────
  const priorityKey = (task.priority as keyof typeof PRIORITY_CONFIG) in PRIORITY_CONFIG
    ? (task.priority as keyof typeof PRIORITY_CONFIG)
    : "MEDIUM";
  const priority = PRIORITY_CONFIG[priorityKey];

  const initials = task.assignedTo
    ? task.assignedTo.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : null;

  const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue =
    dueDateObj && task.status !== "DONE" && dueDateObj < new Date();
  const formattedDue = dueDateObj
    ? dueDateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  // ── Overlay (drag ghost) ────────────────────────────────────────────────────
  const overlayClasses = isOverlay
    ? "rotate-[2deg] scale-105 shadow-2xl shadow-black/20"
    : "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`touch-none cursor-grab active:cursor-grabbing ${overlayClasses}`}
    >
      {/* ── Card Shell ──────────────────────────────────────────────────────── */}
      <div
        className="
          relative group rounded-xl bg-card border border-border
          shadow-sm overflow-hidden
          hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5
          transition-all duration-300
        "
      >
        {/* ── Left Priority Accent Bar ─────────────────────────────────────── */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
          style={{ backgroundColor: priority.bar }}
        />

        {/* ── Card Body ────────────────────────────────────────────────────── */}
        <div className="pl-4 pr-3 pt-3 pb-3">

          {/* Task ID + Actions Row */}
          <div className="flex items-start justify-between mb-1.5">
            <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.15em]">
              #{task.id}
            </span>

            {/* Action Buttons — hidden until group hover */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {isAdmin && (
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditModalOpen(true);
                  }}
                  title="Edit task"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-150"
                >
                  <Edit2 size={13} />
                </button>
              )}
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete task #${task.id}?`)) {
                    deleteTask(task.id)
                      .then(() => router.refresh())
                      .catch((err) => alert("Error: " + err.message));
                  }
                }}
                title="Delete task"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors duration-150"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Task Title */}
          <h3 className="text-sm font-bold leading-snug line-clamp-2 text-foreground mb-2 pr-1">
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-[11px] text-muted-foreground/70 line-clamp-2 italic mb-3 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* ── Footer Row ─────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between">
            {/* Priority Badge */}
            <span
              className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-[0.12em] ${priority.badge}`}
            >
              {task.priority}
            </span>

            {/* Assignee */}
            {task.assignedTo ? (
              <div className="relative group/avatar">
                <div
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[9px] font-black text-white shadow-sm ring-2 ring-background cursor-default"
                  title={task.assignedTo.name}
                >
                  {initials}
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-1.5 hidden group-hover/avatar:flex flex-col items-end pointer-events-none z-50">
                  <div className="bg-popover border border-border rounded-lg px-2.5 py-1.5 shadow-xl text-[11px] font-bold text-popover-foreground whitespace-nowrap">
                    {task.assignedTo.name}
                    <span className="block text-[9px] font-normal text-muted-foreground mt-0.5">
                      {task.assignedTo.designation}
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-popover border-r border-b border-border rotate-45 -mt-1 mr-2.5" />
                </div>
              </div>
            ) : (
              <div
                className="w-7 h-7 rounded-full border-2 border-dashed border-muted-foreground/20 flex items-center justify-center text-muted-foreground/30"
                title="Unassigned"
              >
                <User size={12} />
              </div>
            )}
          </div>

          {/* ── Due Date Row ────────────────────────────────────────────────── */}
          {formattedDue && (
            <div
              className={`flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-border/50 ${
                isOverdue ? "text-red-500/70" : "text-muted-foreground/50"
              }`}
            >
              <Calendar size={10} className={isOverdue ? "text-red-500" : ""} />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isOverdue ? "Overdue · " : ""}{formattedDue}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Edit Modal ───────────────────────────────────────────────────────── */}
      {isEditModalOpen && (
        <div onPointerDown={(e) => e.stopPropagation()}>
          <EditTaskModal
            task={task as any}
            projectId={task.projectId}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
