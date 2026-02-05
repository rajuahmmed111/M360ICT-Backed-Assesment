import { Server } from "http";
import app from "./app";
import config from "./config";
import prisma from "./shared/prisma";

let server: Server;

async function bootstrap() {
  server = app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("❌ Bootstrap error:", error);
  process.exit(1);
});

const shutdown = async (signal: string) => {
  console.log(`👋 ${signal} received. Closing server...`);

  try {
    if (server) {
      server.close(async () => {
        console.log("🛑 HTTP server closed");

        await prisma.$disconnect();
        console.log("📦 Prisma disconnected");

        process.exit(0);
      });
    } else {
      await prisma.$disconnect();
      process.exit(0);
    }
  } catch (error) {
    console.error("Shutdown error:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (error) => {
  console.error("😈 Unhandled Rejection:", error);
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (error) => {
  console.error("😈 Uncaught Exception:", error);
  shutdown("uncaughtException");
});
