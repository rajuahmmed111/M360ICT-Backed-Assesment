import { PrismaClient, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  HrUser,
  CreateHrUserDto,
  LoginDto,
  LoginResponse,
  JwtPayload,
} from "./hr_user.types";
import prisma from "../../../shared/prisma";

// create hr user
const createHrUser = async (
  data: CreateHrUserDto,
): Promise<Omit<HrUser, "passwordHash">> => {
  const existingUser = await prisma.hrUser.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(data.password, saltRounds);

  const user = await prisma.hrUser.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      status: UserStatus.ACTIVE,
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

  return user;
};

// hr login
const hrLogin = async (data: LoginDto): Promise<LoginResponse> => {
  const user = await prisma.hrUser.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash,
  );
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
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
  hrLogin,
  getHrUserById,
};
