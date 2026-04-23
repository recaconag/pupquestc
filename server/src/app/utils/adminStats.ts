import { NextFunction, Request, Response } from "express";
import { foundItemService } from "../modules/foundItems/foundItem.service";
import sendResponse from "../global/response";
import { StatusCodes } from "http-status-codes";
import { lostItemServices } from "../modules/lostItem/lostItem.service";
import { userService } from "../modules/user/user.service";
import { claimsService } from "../modules/claim/claim.service";

export const adminStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [foundItems, lostItems, users, claims] = await Promise.all([
      foundItemService.getFoundItem({}),
      lostItemServices.getLostItem(),
      userService.allUsers(),
      claimsService.getClaim(),
    ]);

    const result = {
      foundItems: foundItems.length,
      lostItems: lostItems.length,
      totalItems: foundItems.length + lostItems.length,
      totalUsers: users.length,
      totalClaims: claims.length,
      pendingClaims: claims.filter((claim: any) => claim.status === "PENDING").length,
      approvedClaims: claims.filter((claim: any) => claim.status === "APPROVED").length,
    };
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin stats retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
