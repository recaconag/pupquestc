-- Add security fields to users table
ALTER TABLE "users" ADD COLUMN "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "users" ADD COLUMN "lockedUntil" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "lastPasswordChange" TIMESTAMP(3);

-- Create SystemSettings singleton table
CREATE TABLE "systemSettings" (
    "id" TEXT NOT NULL,
    "passwordExpiryDays" INTEGER NOT NULL DEFAULT 90,
    "sessionTimeoutMinutes" INTEGER NOT NULL DEFAULT 30,
    "maxLoginAttempts" INTEGER NOT NULL DEFAULT 5,
    "enable2FA" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "systemSettings_pkey" PRIMARY KEY ("id")
);
