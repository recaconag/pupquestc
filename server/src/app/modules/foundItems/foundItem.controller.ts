import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import sendResponse, { TMeta } from "../../global/response";
import { foundItemService } from "./foundItem.service";
import { utils } from "../../utils/utils";

const createFoundItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await foundItemService.createFoundItem(req.body, req.user.id);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Found item reported successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getFoundItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const meta = await utils.calculateMeta(req.query);
    const result = await foundItemService.getFoundItem(req.query);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Found items retrieved successfully",
      meta: meta as TMeta,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleFoundItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await foundItemService.getSingleFoundItem(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Found item retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyFoundItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await foundItemService.getMyFoundItem(req.user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Your found items retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const editMyFoundItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await foundItemService.editMyFoundItem(req.body, req.user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Found item edited successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMyFoundItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await foundItemService.deleteMyFoundItem(id, req.user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Found item deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const getAllFoundItemsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await foundItemService.getAllFoundItemsAdmin();
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "All found items retrieved.", data: result });
  } catch (error) { next(error); }
};

const approveFoundItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await foundItemService.approveFoundItem(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Found item approved and published.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const foundItemController = {
  createFoundItem,
  getFoundItem,
  getSingleFoundItem,
  getMyFoundItem,
  editMyFoundItem,
  deleteMyFoundItem,
  approveFoundItem,
  getAllFoundItemsAdmin,
};
