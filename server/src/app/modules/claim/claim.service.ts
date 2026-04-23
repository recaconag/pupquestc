import { Claim } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../config/prisma";
import AppError from "../../global/error";
import { StatusCodes } from "http-status-codes";

const createClaim = async (item: Claim, user: JwtPayload) => {
  const foundItem = await prisma.foundItem.findUnique({
    where: { id: item.foundItemId }
  });

  if (!foundItem || foundItem.isClaimed) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This item is already claimed or no longer available.");
  }

  if (foundItem.userId === user.id) {
    throw new AppError(StatusCodes.FORBIDDEN, "You cannot file a claim for an item you reported yourself.");
  }

  const result = await prisma.claim.create({
    data: {
      foundItemId: item.foundItemId,
      distinguishingFeatures: item.distinguishingFeatures,
      lostDate: item.lostDate,
      userId: user.id,
    },
  });
  return result;
};
const getClaim = async () => {
  const result = await prisma.claim.findMany({
    where: {
      isDeleted: false,
      foundItem: { isDeleted: false },
    },
    include: {
      user: { // Impormasyon ng nag-ki-claim
        select: { id: true, name: true, email: true }
      },
      foundItem: { // Impormasyon ng item na ki-claim
        include: {
          category: true,
          user: { // Impormasyon ng nakahanap (finder)
            select: { id: true, name: true, email: true }
          },
        },
      },
    },
  });
  return result;
};
const getMyClaim = async (user: JwtPayload) => {
  const result = await prisma.claim.findMany({
    where: {
      userId: user.id,
      foundItem: {
        isDeleted: false, // Only get claims for non-deleted found items
      },
    },
    include: {
      foundItem: {
        include: {
          category: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return result;
};

const updateClaimStatus = async (claimId: string, data: Partial<Claim>) => {
  return await prisma.$transaction(async (tx) => {
    const updatedClaim = await tx.claim.update({
      where: { id: claimId },
      data,
    });

    if (data.status === "APPROVED") {
      await tx.foundItem.update({
        where: { id: updatedClaim.foundItemId },
        data: { isClaimed: true },
      });
      
      await tx.claim.updateMany({
        where: {
          foundItemId: updatedClaim.foundItemId,
          id: { not: claimId },
          status: "PENDING"
        },
        data: { status: "REJECTED" }
      });
    }

    return updatedClaim;
  });
};

export const claimsService = {
  createClaim,
  getClaim,
  updateClaimStatus,
  getMyClaim,
};
