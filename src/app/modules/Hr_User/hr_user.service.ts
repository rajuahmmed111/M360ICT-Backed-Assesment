import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  HrUser,
  CreateHrUserDto,
} from "./hr_user.types";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

// create hr user
const createHrUser = async (
  data: CreateHrUserDto
): Promise<Omit<HrUser, "passwordHash">> => {

  const existingUser = await prisma.hrUser.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  return await prisma.hrUser.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};



// get hr user by id
const getHrUserById = async (
  id: string,
): Promise<Omit<HrUser, "passwordHash"> | null> => {
  const user = await prisma.hrUser.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export const HrUserService = {
  createHrUser,
  getHrUserById,
};
