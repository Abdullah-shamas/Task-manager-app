'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. Naya Task Add Karna
export async function createTask(formData: FormData) {
  const title = formData.get('title') as string;
  const projectId = Number(formData.get('projectId'));

  if (!title || !title.trim()) return;

  await prisma.task.create({
    data: {
      title: title.trim(),
      projectId,
      status: 'TODO',
    },
  });

  revalidatePath('/');
}

// 2. Status Toggle Karna (TODO <-> DONE)
export async function toggleTaskStatus(taskId: number, currentStatus: string) {
  const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';

  await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });

  revalidatePath('/');
}

// 3. Task Delete Karna
export async function deleteTask(taskId: number) {
  await prisma.task.delete({
    where: { id: taskId },
  });

  revalidatePath('/');
}