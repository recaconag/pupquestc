-- Add SMTP configuration fields to systemSettings
ALTER TABLE "systemSettings" ADD COLUMN "smtpHost"      TEXT    NOT NULL DEFAULT 'smtp.gmail.com';
ALTER TABLE "systemSettings" ADD COLUMN "smtpPort"      INTEGER NOT NULL DEFAULT 587;
ALTER TABLE "systemSettings" ADD COLUMN "smtpUser"      TEXT    NOT NULL DEFAULT '';
ALTER TABLE "systemSettings" ADD COLUMN "smtpPass"      TEXT    NOT NULL DEFAULT '';
ALTER TABLE "systemSettings" ADD COLUMN "smtpSecure"    BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "systemSettings" ADD COLUMN "smtpFromName"  TEXT    NOT NULL DEFAULT 'PUPQuestC Support';
ALTER TABLE "systemSettings" ADD COLUMN "smtpFromEmail" TEXT    NOT NULL DEFAULT '';
