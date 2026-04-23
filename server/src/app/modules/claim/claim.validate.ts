import { CLAIM_STATUS } from "../../global/globalValues";
import { z } from "zod";
const createClaim = z.object({
  body: z.object({
    foundItemId: z
      .string({
        required_error: "Item ID is required to file a claim",
      })
      .uuid("Invalid Item ID format"),
    distinguishingFeatures: z
      .string({
        required_error: "Please provide distinguishing features to prove ownership",
      })
      .min(10, "Description must be at least 10 characters long for verification"),
    lostDate: z.string({
      required_error: "Please provide the date when you lost the item",
    }),
  }),
});
const updateClaim = z.object({
  body: z.object({
    status: z
      .enum([CLAIM_STATUS.PENDING, CLAIM_STATUS.APPROVED, CLAIM_STATUS.REJECTED], {
        required_error: "Status is required for update",
      })
      .optional(),
  }).strict("Only status updates are allowed through this endpoint"),
});

export const ItemClaimSchema = {
  createClaim,
  updateClaim,
};
