import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Purana data clear karein
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  // Naya project aur tasks create karein
  await prisma.project.create({
    data: {
      title: 'Full Stack Development',
      tasks: {
        create: [
          { title: 'Setup Neon Database', status: 'DONE' },
          { title: 'Configure Prisma Models', status: 'DONE' },
          { title: 'Build Task UI & Actions', status: 'TODO' },
        ],
      },
    },
  });

  console.log('Seed data successfully added to Neon DB!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });