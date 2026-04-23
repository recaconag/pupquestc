-- Add item management fields to systemSettings
ALTER TABLE "systemSettings" ADD COLUMN "itemExpiryDays" INTEGER NOT NULL DEFAULT 30;
ALTER TABLE "systemSettings" ADD COLUMN "maxImageSizeMb" INTEGER NOT NULL DEFAULT 5;
ALTER TABLE "systemSettings" ADD COLUMN "autoDeleteExpiredItems" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "systemSettings" ADD COLUMN "requireItemApproval" BOOLEAN NOT NULL DEFAULT false;

-- Add approval + expiry tracking to foundItems
ALTER TABLE "foundItems" ADD COLUMN "approvalStatus" TEXT NOT NULL DEFAULT 'PUBLISHED';
ALTER TABLE "foundItems" ADD COLUMN "isExpired" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "foundItems" ADD COLUMN "expiredAt" TIMESTAMP(3);

-- Add approval + expiry tracking to lostItems
ALTER TABLE "lostItems" ADD COLUMN "approvalStatus" TEXT NOT NULL DEFAULT 'PUBLISHED';
ALTER TABLE "lostItems" ADD COLUMN "isExpired" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "lostItems" ADD COLUMN "expiredAt" TIMESTAMP(3);
