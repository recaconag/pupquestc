import { z } from "zod";

const aiSearchSchema = z.object({
  body: z.object({
    query: z
      .string({
        required_error: "Search query is required",
      })
      .trim()
      .min(1, "Search query cannot be empty")
      .max(500, "Search query is too long. Please be more concise."),
  }),
});

export const aiSearchValidation = {
  aiSearchSchema,
};
