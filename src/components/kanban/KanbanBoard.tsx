"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext, DragOverlay, closestCorners, KeyboardSensor,
  PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "@/actions/task";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
const COLUMNS: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

interface AssignedUser {
  id: string;
  name: string;
  designation: string;
}

interface Task {
  id: number;
  projectId: string;
  title: string;
  status: TaskStatus;
  priority: string;
  description?: string | null;
  dueDate?: Date | string | null;
  assignedTo?: AssignedUser | null;
  assignedToUserId?: string | null;
}

export function KanbanBoard({
  initialTasks,
  projectId,
}: {
  initialTasks: Task[];
  projectId: string;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [mounted, setMounted] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync with server when initialTasks change (e.g. after router.refresh)
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const mutation = useMutation({
    mutationFn: updateTaskStatus,
    onMutate: async (newStatusData) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
      const previousTasks = queryClient.getQueryData(["tasks", projectId]);

      queryClient.setQueryData(
        ["tasks", projectId],
        (old: Task[] | undefined) =>
          (old || []).map((task) =>
            task.id === newStatusData.taskId
              ? { ...task, status: newStatusData.status as TaskStatus }
              : task
          )
      );
      return { previousTasks };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(
        ["tasks", projectId],
        context?.previousTasks
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overColumn = over.id as TaskStatus;

    if (
      activeTask &&
      activeTask.status !== overColumn &&
      COLUMNS.includes(overColumn)
    ) {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === activeTask.id ? { ...t, status: overColumn } : t
        )
      );
      mutation.mutate({ taskId: activeTask.id, status: overColumn });
    }
  };

  // Render a static layout on the server to avoid dnd-kit aria-describedby hydration mismatch
  if (!mounted) {
    return (
      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto p-4 w-full h-full">
        {COLUMNS.map((colId) => (
          <Column
            key={colId}
            id={colId}
            tasks={tasks.filter((t) => t.status === colId)}
          />
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto p-4 w-full h-full">
        {COLUMNS.map((colId) => (
          <Column
            key={colId}
            id={colId}
            tasks={tasks.filter((t) => t.status === colId)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeId ? (
          <TaskCard
            task={tasks.find((t) => t.id === activeId)!}
            isOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
