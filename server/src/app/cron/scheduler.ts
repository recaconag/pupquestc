import cron from "node-cron";
import prisma from "../config/prisma";
import { systemSettingsService } from "../modules/systemSettings/systemSettings.service";

export const startScheduler = () => {
  // Runs every day at midnight (00:00)
  cron.schedule("0 0 * * *", async () => {
    console.log("[Cron] Running nightly item expiry + cleanup job...");
    try {
      const settings = await systemSettingsService.getSettings();

      if (settings.itemExpiryDays <= 0) {
        console.log("[Cron] Item expiry disabled (itemExpiryDays = 0). Skipping.");
        return;
      }

      const cutoff = new Date(Date.now() - settings.itemExpiryDays * 86400000);

      // ── Mark expired (not yet expired) ──────────────────────────────
      const [expiredFound, expiredLost] = await Promise.all([
        prisma.foundItem.updateMany({
          where: {
            isDeleted: false,
            isExpired: false,
            isClaimed: false,
            createdAt: { lt: cutoff },
          },
          data: { isExpired: true, expiredAt: new Date() },
        }),
        prisma.lostItem.updateMany({
          where: {
            isDeleted: false,
            isExpired: false,
            isFound: false,
            createdAt: { lt: cutoff },
          },
          data: { isExpired: true, expiredAt: new Date() },
        }),
      ]);

      console.log(
        `[Cron] Marked expired — Found: ${expiredFound.count}, Lost: ${expiredLost.count}`
      );

      // ── Auto-delete if enabled ────────────────────────────────────────
      if (settings.autoDeleteExpiredItems) {
        const [deletedFound, deletedLost] = await Promise.all([
          prisma.foundItem.updateMany({
            where: { isExpired: true, isDeleted: false },
            data: { isDeleted: true, deletedAt: new Date() },
          }),
          prisma.lostItem.updateMany({
            where: { isExpired: true, isDeleted: false },
            data: { isDeleted: true, deletedAt: new Date() },
          }),
        ]);

        console.log(
          `[Cron] Auto-deleted — Found: ${deletedFound.count}, Lost: ${deletedLost.count}`
        );
      }
    } catch (err) {
      console.error("[Cron] Nightly job failed:", err);
    }
  });

  console.log("[Cron] Nightly scheduler registered (00:00 daily).");
};
