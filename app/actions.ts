// app/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

// 1. User Registration
export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    throw new Error('Email aur password required hain');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email pehle se registered hai');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'USER',
    },
  });

  redirect('/login');
}

// 2. Create Task
export async function createTask(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      console.error("No session found");
      return;
    }

    const title = formData.get('title') as string;
    if (!title || !title.trim()) return;

    let targetUserId = session.user.id;

    // Fallback if session token doesn't have ID yet
    if (!targetUserId) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      targetUserId = dbUser?.id;
    }

    if (!targetUserId) {
      console.error("User not found in DB");
      return;
    }

    await prisma.task.create({
      data: {
        title: title.trim(),
        userId: targetUserId,
      },
    });

    revalidatePath('/dashboard');
  } catch (error) {
    console.error("Error creating task:", error);
  }
}

// 3. Toggle Task Status
export async function toggleTaskStatus(taskId: string, currentStatus: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.email) return;

    await prisma.task.update({
      where: { id: taskId },
      data: { isCompleted: !currentStatus },
    });

    revalidatePath('/dashboard');
  } catch (error) {
    console.error("Error toggling task:", error);
  }
}

// 4. Delete Task
export async function deleteTask(taskId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) return;

    await prisma.task.delete({
      where: { id: taskId },
    });

    revalidatePath('/dashboard');
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}