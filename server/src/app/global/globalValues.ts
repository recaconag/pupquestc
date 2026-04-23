export const CLAIM_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export const USER_ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type TClaimStatus = (typeof CLAIM_STATUS)[keyof typeof CLAIM_STATUS];
export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];