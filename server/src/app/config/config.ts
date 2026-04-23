import dotenv from "dotenv";
import path from "path";

const envPath = path.join(process.cwd(), ".env");

dotenv.config({ path: envPath });

const requireEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const env = process.env.NODE_ENV || "development";

const toNumber = (value: unknown, fallback: number) => {
  const n = typeof value === "string" ? Number(value) : Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export default {
  env,
  port: toNumber(process.env.PORT, 5000),
  database_url: process.env.DATABASE_URL,
  salt_rounds: toNumber(process.env.BCRYPT_SALTROUNDS, 12),
  jwt: {
    secret:
      env === "production"
        ? requireEnv("JWT_SECRETS")
        : (process.env.JWT_SECRETS || "dev-insecure-secret-change-me"),
    expires_in: process.env.JWT_EXPIRES_IN || "7d",
  },
  client_url: process.env.CLIENT_URL || "http://localhost:5173",
  gemini_api_key: process.env.GEMINI_API_KEY,
  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: toNumber(process.env.SMTP_PORT, 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@pupquestc.com",
  },
};
