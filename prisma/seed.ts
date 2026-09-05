import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Purana project code comment kar diya hai
  console.log("Database reset successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });