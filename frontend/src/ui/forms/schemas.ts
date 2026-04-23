import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "PUP Webmail is required")
    .max(120, "Too long"),
  password: z.string().min(1, "Password is required").max(200, "Too long"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const reportLostSchema = z.object({
  lostItemName: z
    .string()
    .trim()
    .min(1, "Lost item name is required")
    .max(200, "Too long"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Too long"),
  imgUrl: z.string().min(1, "Please upload an image"),
  location: z
    .string()
    .trim()
    .min(1, "Location is required")
    .max(500, "Too long"),
  categoryId: z.string().min(1, "Category is required"),
});

export type ReportLostValues = z.infer<typeof reportLostSchema>;

export const reportFoundSchema = z.object({
  foundItemName: z
    .string()
    .trim()
    .min(1, "Found item name is required")
    .max(200, "Too long"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Too long"),
  imgUrl: z.string().min(1, "Please upload an image"),
  location: z
    .string()
    .trim()
    .min(1, "Location is required")
    .max(500, "Too long"),
  claimProcess: z
    .string()
    .trim()
    .min(1, "Claim process is required")
    .max(1000, "Too long"),
  categoryId: z.string().min(1, "Category is required"),
});

export type ReportFoundValues = z.infer<typeof reportFoundSchema>;

export const editFoundItemSchema = z.object({
  foundItemName: z
    .string()
    .trim()
    .min(1, "Item name is required")
    .max(200, "Too long"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Too long"),
  location: z
    .string()
    .trim()
    .min(1, "Location is required")
    .max(500, "Too long"),
  date: z
    .string()
    .min(1, "Date is required")
    .refine((d) => !Number.isNaN(Date.parse(d)), "Invalid date"),
});

export type EditFoundItemValues = z.infer<typeof editFoundItemSchema>;

export const editLostItemSchema = z.object({
  lostItemName: z
    .string()
    .trim()
    .min(1, "Item name is required")
    .max(200, "Too long"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Too long"),
  location: z
    .string()
    .trim()
    .min(1, "Location is required")
    .max(500, "Too long"),
  date: z
    .string()
    .min(1, "Date is required")
    .refine((d) => !Number.isNaN(Date.parse(d)), "Invalid date"),
});

export type EditLostItemValues = z.infer<typeof editLostItemSchema>;

export const categoryNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(80, "Name is too long (max 80 characters)"),
});

export type CategoryNameValues = z.infer<typeof categoryNameSchema>;

const PUP_DOMAINS = ["@iskolarngbayan.pup.edu.ph", "@pup.edu.ph"];

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Too long"),
    email: z
      .string()
      .trim()
      .min(1, "PUP Webmail is required")
      .email("Enter a valid email address")
      .refine((e) => PUP_DOMAINS.some((d) => e.endsWith(d)), {
        message: "Please use your official PUPQC email (@iskolarngbayan.pup.edu.ph or @pup.edu.ph) to register.",
      }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(200, "Too long"),
    conpassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.conpassword, {
    message: "Passwords do not match",
    path: ["conpassword"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;

