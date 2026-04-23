import { NextFunction, Request, Response } from "express";
import sendResponse from "../global/response";
import { StatusCodes } from "http-status-codes";
import { authServices } from "./auth.service";
import { TLogin } from "../global/interface";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: TLogin = req.body;
    const result = await authServices.loginUser(user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const newPasswords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const passwordData = req.body;
    const result = await authServices.newPasswords(passwordData, req.user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const changeEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.body;
    const result = await authServices.changeEmail(email, req.user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Email changed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


const updateProfileImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userImg } = req.body;
    const result = await authServices.updateProfileImage(req.user.id, userImg);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Profile image updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfileName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, middleName = "", lastName } = req.body;
    const result = await authServices.updateProfileName(req.user.id, firstName, middleName, lastName);
    if (result?.token) {
      res.setHeader("X-New-Token", result.token);
    }
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Profile updated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authServices.forgotPassword(req.body.email);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "If an account with that email exists, a recovery code has been sent.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const verifyRecoveryOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    await authServices.verifyRecoveryOtp(email, otp);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Recovery code verified successfully.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const verify2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, otp } = req.body;
    const result = await authServices.verify2FA(userId, otp);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "2FA verification successful. Login complete.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, newPassword } = req.body;
    await authServices.resetPassword(email, otp, newPassword);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password has been reset successfully.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  login,
  verify2FA,
  newPasswords,
  changeEmail,
  updateProfileImage,
  updateProfileName,
  forgotPassword,
  verifyRecoveryOtp,
  resetPassword,
}
