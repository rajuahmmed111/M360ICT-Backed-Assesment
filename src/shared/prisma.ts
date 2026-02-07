import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// handle prisma connection issues
async function connectPrisma() {
  try {
    await prisma.$connect();
    console.log("Prisma connected to the database successfully!");
  } catch (error) {
    console.error("Prisma connection failed:", error);
    process.exit(1); // exit process with failure
  }

  // graceful shutdown
  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    console.log("Prisma disconnected due to application termination.");
    process.exit(0);
  });
}

connectPrisma();

export default prisma;
