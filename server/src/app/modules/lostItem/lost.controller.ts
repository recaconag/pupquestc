import { NextFunction, Request, Response } from "express";
import sendResponse from "../../global/response";
import { StatusCodes } from "http-status-codes";
import { lostItemServices } from "./lostItem.service";

const toggleFoundStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body;
    const result = await lostItemServices.toggleFoundStatus(id);
    const message = result.isFound
      ? "Item marked as found successfully"
      : "Item marked as not found successfully";

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createLostItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await lostItemServices.createLostItem(req.user.id, req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Lost item reported successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getLostItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await lostItemServices.getLostItem();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Lost items retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleLostItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await lostItemServices.getSingleLostItem(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Lost item retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyLostItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await lostItemServices.getMyLostItem(req.user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Your lost items retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const editMyLostItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await lostItemServices.editMyLostItem(req.body, req.user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Lost item edited successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMyLostItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // Ipinapasa ang req.user para sa ownership check sa service
    await lostItemServices.deleteMyLostItem(id, req.user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Lost item deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const getAllLostItemsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await lostItemServices.getAllLostItemsAdmin();
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "All lost items retrieved.", data: result });
  } catch (error) { next(error); }
};

const approveLostItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await lostItemServices.approveLostItem(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Lost item approved and published.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const lostItemController = {
  toggleFoundStatus,
  createLostItem,
  getLostItem,
  getSingleLostItem,
  getMyLostItem,
  editMyLostItem,
  deleteMyLostItem,
  approveLostItem,
  getAllLostItemsAdmin,
};
