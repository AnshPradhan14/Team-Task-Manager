"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "MEMBER"]),
  designation: z.string().min(1, "Designation is required"),
});

export type SignupInput = z.infer<typeof SignupSchema>;

export async function signupUser(data: SignupInput) {
  const validated = SignupSchema.parse(data);

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: validated.email },
  });

  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(validated.password, 12);

  // Create the user
  const user = await prisma.user.create({
    data: {
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
      role: validated.role,
      designation: validated.designation,
    },
  });

  return { id: user.id, name: user.name, email: user.email };
}
