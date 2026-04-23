import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import multer from "multer";
import AppError from "../global/error";
import config from "../config/config";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err?.message || "Something went wrong!";
  let errorDetails: unknown | undefined = undefined;

  // 1. Prisma Validation Errors
  if (err instanceof PrismaClientValidationError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Invalid input data format";
  } 
  
  // 2. Prisma Known Errors (Database Constraints)
  else if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = StatusCodes.CONFLICT;
      const field = (err.meta?.target as string[])?.join(", ") || "field";
      message = `This ${field} is already in use. Please use a different one.`;
    } else if (err.code === "P2025") {
      statusCode = StatusCodes.NOT_FOUND;
      message = "Record not found in the database";
    }
  } 
  
  // 3. Zod Validation Errors (Frontend input validation)
  else if (err instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = err.errors.map((e) => e.message).join(". ");
    errorDetails = {
      issues: err.errors.map((e) => ({
        field: e.path.map(String).join(".") || "unknown",
        message: e.message,
      })),
    };
  } 
  
  // 4. JWT errors — always 401
  else if (err instanceof TokenExpiredError) {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Session expired. Please log in again.";
  }
  else if (err instanceof JsonWebTokenError || err instanceof NotBeforeError) {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Invalid or malformed token. Please log in again.";
  }

  // 5. Multer upload errors — 400 or 413
  else if (err instanceof multer.MulterError) {
    statusCode =
      err.code === "LIMIT_FILE_SIZE"
        ? StatusCodes.REQUEST_TOO_LONG
        : StatusCodes.BAD_REQUEST;
    const codeMessages: Record<string, string> = {
      LIMIT_FILE_SIZE:        "File is too large. Please upload a smaller image.",
      LIMIT_FILE_COUNT:       "Too many files uploaded at once.",
      LIMIT_UNEXPECTED_FILE:  `Unexpected field '${err.field}'. Use field name 'image'.`,
      LIMIT_FIELD_COUNT:      "Too many form fields.",
      LIMIT_FIELD_KEY:        "Field name is too long.",
      LIMIT_FIELD_VALUE:      "Field value is too long.",
      LIMIT_PART_COUNT:       "Too many parts in the multipart request.",
    };
    message = codeMessages[err.code] ?? `Upload error: ${err.message}`;
  }

  // 6. Custom App Errors
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Development-only: safe debug metadata (never return raw error objects)
  if (config.env === "development") {
    const baseDebug = {
      name: err?.name,
      message: err?.message,
    };
    errorDetails =
      typeof errorDetails === "undefined" ? baseDebug : { ...baseDebug, ...(errorDetails as any) };
  }

  // Final Response
  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
    stack: config.env === "development" ? err.stack : undefined,
  });
};

export default errorHandler;