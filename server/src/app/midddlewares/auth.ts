import { NextFunction, Request, Response } from "express";
import { utils } from "../utils/utils";
import AppError from "../global/error";
import { StatusCodes } from "http-status-codes";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          "Access denied. Missing Authorization header."
        );
      }

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length).trim()
        : authHeader.trim();

      if (!token) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Access denied. Invalid token.");
      }

      const verifiedUser = utils.verifyToken(token);

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new AppError(
          StatusCodes.FORBIDDEN, 
          "You don't have permission to access this resource"
        );
      }

      req.user = verifiedUser as typeof req.user;
      
      next();
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, "Session expired. Please log in again."));
      }
      if (err instanceof JsonWebTokenError) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, "Invalid token. Please log in again."));
      }
      next(err);
    }
  };
};

export default auth;