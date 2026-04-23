import { ItemCategory } from "@prisma/client";
import prisma from "../../config/prisma";

import AppError from "../../global/error";
import { StatusCodes } from "http-status-codes";

const createItemCategory = async (data: ItemCategory) => {
  const isExist = await prisma.itemCategory.findFirst({
    where: { name: { equals: data.name, mode: 'insensitive' } }
  });

  if (isExist) {
    throw new AppError(StatusCodes.CONFLICT, "Category name already exists.");
  }

  const result = await prisma.itemCategory.create({
    data,
  });

  return result;
};

const getItemCategory = async () => {
  const result = await prisma.itemCategory.findMany({
    orderBy: {
      name: 'asc' 
    }
  });
  return result;
};

const updateItemCategory = async (id: string, data: Partial<ItemCategory>) => {
  const isExist = await prisma.itemCategory.findUnique({ where: { id } });

  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found.");
  }

  const result = await prisma.itemCategory.update({
    where: { id },
    data,
  });
  return result;
};

const deleteItemCategory = async (id: string) => {
  const isExist = await prisma.itemCategory.findUnique({ where: { id } });

  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found.");
  }

  const result = await prisma.itemCategory.delete({
    where: { id },
  });
  return result;
};

export const itemCategoryService = {
  createItemCategory,
  getItemCategory,
  updateItemCategory,
  deleteItemCategory,
};
