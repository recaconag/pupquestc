/**
 * server.ts — Backend Entry Point
 *
 * This is the first file that runs when you start the backend (npm run dev).
 * It does the following:
 *
 * 1. Starts the Express HTTP server on the configured PORT (default: 5000).
 * 2. Launches the background scheduler (cron jobs) — e.g., auto-expiring
 *    old found items after 30 days.
 * 3. Prints startup diagnostics to the terminal (port, SMTP config, etc.)
 *    so you can confirm everything is connected correctly.
 * 4. Listens for unhandled errors so the server can shut down gracefully
 *    instead of crashing silently.
 *
 * The actual Express app configuration (routes, middleware) lives in app.ts.
 */
import { Server } from "http";
import app from "./app";
import config from "./app/config/config";
import { startScheduler } from "./app/cron/scheduler";

let server: Server;

async function main() {
  try {
    server = app.listen(config.port, () => {
      console.log(`🚀 PUPQuestC Server is running on port: ${config.port}`);
      startScheduler();
      console.log(`📧 SMTP Diagnostics:`);
      console.log(`   HOST : ${config.smtp.host}`);
      console.log(`   PORT : ${config.smtp.port}`);
      console.log(`   SECURE: ${config.smtp.secure}`);
      console.log(`   USER : ${config.smtp.user || "⚠️  NOT SET"}`);
      console.log(`   PASS : ${config.smtp.pass ? "✅ SET (" + config.smtp.pass.length + " chars)" : "⚠️  NOT SET"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
}

main();

// Handle unhandled promise rejections (Security/Stability fix)
process.on("unhandledRejection", (error) => {
  console.log(`😈 unhandledRejection is detected, shutting down ...`, error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Handle synchronous exceptions
process.on("uncaughtException", () => {
  console.log(`😈 uncaughtException is detected, shutting down ...`);
  process.exit(1);
});