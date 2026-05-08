"use server"

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function deleteProject(projectId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  if (session.user.role !== "ADMIN") {
    throw new Error("Forbidden: Only Administrators can delete projects.");
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  revalidatePath("/projects");
}
