import { NextFunction, Request, Response } from "express";
import sendResponse from "../../global/response";
import { StatusCodes } from "http-status-codes";
import { aiSearchService } from "./aiSearch.service";

const aiSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query } = req.body;

    const result = await aiSearchService.aiSearchItems(query);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "AI search completed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const aiSearchController = {
  aiSearch,
};
