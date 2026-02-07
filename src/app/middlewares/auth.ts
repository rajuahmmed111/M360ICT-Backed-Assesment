import { NextFunction, Request, Response } from "express";

import { Secret } from "jsonwebtoken";
import config from "../../config";

import { UserStatus } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiErrors";
import { jwtHelpers } from "../../helpars/jwtHelpers";
import prisma from "../../shared/prisma";

//  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN)

const auth = () => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret,
      );

      const hrUser = await prisma.hrUser.findUnique({
        where: {
          email: verifiedUser.email,
        },
      });

      if (!hrUser) {
        throw new ApiError(httpStatus.NOT_FOUND, "HR user not found");
      }

      if (hrUser.status === UserStatus.INACTIVE) {
        throw new ApiError(httpStatus.FORBIDDEN, "HR user is inactive");
      }

      req.user = hrUser;

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
