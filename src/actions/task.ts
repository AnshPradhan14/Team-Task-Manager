"use server"

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: z.coerce.date().optional(),
  projectId: z.string().min(1, "Project ID is required"),
  assignedToUserId: z.string().optional(),
});

const UpdateTaskStatusSchema = z.object({
  taskId: z.number(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
});

export async function createTask(data: z.infer<typeof TaskSchema>) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  // RBAC: Only admins can create tasks
  if (session.user.role !== "ADMIN") {
    throw new Error("Forbidden: Only administrators can create tasks.");
  }

  const validatedData = TaskSchema.parse(data);

  const task = await prisma.task.create({
    data: {
      ...validatedData,
      // If no assignee is provided, it stays null
    },
  });

  revalidatePath(`/projects/${validatedData.projectId}`);
  revalidatePath(`/`);
  return task;
}

export async function updateTaskStatus(data: z.infer<typeof UpdateTaskStatusSchema>) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const validatedData = UpdateTaskStatusSchema.parse(data);

  const existingTask = await prisma.task.findUnique({
    where: { id: validatedData.taskId },
  });

  if (!existingTask) throw new Error("Task not found");

  if (session.user.role !== "ADMIN" && existingTask.assignedToUserId !== session.user.id) {
    throw new Error("Forbidden: You can only update tasks assigned to you.");
  }

  const updateData: any = { status: validatedData.status };

  if (validatedData.status === "DONE") {
    updateData.completedAt = new Date();
    updateData.completedByUserId = session.user.id;
  } else {
    updateData.completedAt = null;
    updateData.completedByUserId = null;
  }

  const updatedTask = await prisma.task.update({
    where: { id: validatedData.taskId },
    data: updateData,
  });

  revalidatePath(`/projects/${existingTask.projectId}`);
  revalidatePath(`/`);
  return updatedTask;
}

export async function deleteTask(taskId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const existingTask = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existingTask) throw new Error("Task not found");

  // RBAC: Only admins can delete tasks
  if (session.user.role !== "ADMIN") {
    throw new Error("Forbidden: Only administrators can delete tasks.");
  }

  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath(`/projects/${existingTask.projectId}`);
  revalidatePath(`/`);
}

export async function updateTask(taskId: number, data: Partial<z.infer<typeof TaskSchema>>) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  if (session.user.role !== "ADMIN") {
    throw new Error("Forbidden: Only administrators can modify task details.");
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data,
  });

  revalidatePath(`/projects/${updatedTask.projectId}`);
  revalidatePath(`/`);
  return updatedTask;
}

export async function getTaskActivity(projectId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const activity = await prisma.task.findMany({
    where: { projectId },
    include: {
      assignedTo: { select: { name: true, id: true } },
      completedBy: { select: { name: true, id: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  return activity;
}
