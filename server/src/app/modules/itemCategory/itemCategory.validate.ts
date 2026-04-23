import { z } from "zod";

const createItemCategorySchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Category name is required",
      })
      .trim()
      .min(2, "Category name must be at least 2 characters long")
      .max(50, "Category name cannot exceed 50 characters"),
  }),
});

const updateItemCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters long")
      .max(50, "Category name cannot exceed 50 characters")
      .optional(),
  }),
});

export const FoundItemCategorySchema = {
  createItemCategory: createItemCategorySchema,
  updateItemCategory: updateItemCategorySchema,
};