"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getEmployees() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  if (session.user.role !== "ADMIN") {
    throw new Error("Forbidden: Only administrators can view the team list.");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      designation: true,
    },
    orderBy: { name: "asc" },
  });

  return users;
}
