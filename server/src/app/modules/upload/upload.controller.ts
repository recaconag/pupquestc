import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../global/response";
import { systemSettingsService } from "../systemSettings/systemSettings.service";
import fs from "fs";

const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "No file uploaded" });
      return;
    }

    const settings = await systemSettingsService.getSettings();
    const maxBytes = settings.maxImageSizeMb * 1024 * 1024;

    if (req.file.size > maxBytes) {
      fs.unlink(req.file.path, () => {});
      res.status(StatusCodes.REQUEST_TOO_LONG).json({
        success: false,
        message: `File too large. Maximum allowed size is ${settings.maxImageSizeMb} MB.`,
      });
      return;
    }

    const serverUrl =
      process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;

    const fileUrl = `${serverUrl}/uploads/${req.file.filename}`;

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Image uploaded successfully",
      data: { url: fileUrl, filename: req.file.filename },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadController = { uploadImage };
