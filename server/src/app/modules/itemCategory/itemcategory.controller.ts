import { NextFunction, Request, Response } from "express";
import sendResponse from "../../global/response";
import { StatusCodes } from "http-status-codes";
import { itemCategoryService } from "./itemCategory.service";

const createItemCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await itemCategoryService.createItemCategory(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Item category created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getItemCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await itemCategoryService.getItemCategory();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Item categories retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateItemCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await itemCategoryService.updateItemCategory(id, req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Item category updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteItemCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await itemCategoryService.deleteItemCategory(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Item category deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const itemcategoryController = {
  createItemCategory,
  getItemCategory,
  updateItemCategory,
  deleteItemCategory,
};
