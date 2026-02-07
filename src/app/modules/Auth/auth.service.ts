import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { JwtPayload, LoginDto, LoginResponse } from "./auth.type";

// login
const Login = async (data: LoginDto): Promise<LoginResponse> => {
  const user = await prisma.hrUser.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid credentials");
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

export const AuthService = {
  Login,
};
