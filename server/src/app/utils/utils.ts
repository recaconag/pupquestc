import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config/config";
import prisma from "../config/prisma";

const passwordHash = async (password: string) => {
  const saltRounds = Number(config.salt_rounds);
  const hashedPassword: string = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const comparePasswords = async (
  plainTextPassword: string,
  hashedPassword: string
) => {
  const match: boolean = await bcrypt.compare(
    plainTextPassword,
    hashedPassword
  );
  return match;
};

const createToken = (data: Record<string, unknown>, expiresIn?: string): string => {
  return jwt.sign(data, config.jwt.secret as Secret, {
    algorithm: "HS256",
    expiresIn: (expiresIn || config.jwt.expires_in) as any,
  });
};

const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret as Secret) as JwtPayload;
};

const calculateMeta = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  
  const total = await prisma.foundItem.count({
    where: { isDeleted: false }
  });

  const totalPage = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPage,
  };
};

export const utils = {
  passwordHash,
  comparePasswords,
  createToken,
  verifyToken,
  calculateMeta,
};
