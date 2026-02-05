import * as bcrypt from "bcrypt";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Prisma, User, UserRole, UserStatus } from "@prisma/client";
import { ObjectId } from "mongodb";
import { IPaginationOptions } from "../../../interfaces/paginations";
import {
  IFilterRequest,
  IProfileImageResponse,
  IUpdateUser,
  SafeUser,
} from "./user.interface";
import { paginationHelpers } from "../../../helpars/paginationHelper";
import { searchableFields } from "./user.constant";
import { IGenericResponse } from "../../../interfaces/common";
import { IUploadedFile } from "../../../interfaces/file";
import { uploadFile } from "../../../helpars/fileUploader";
import { Request } from "express";
import { getDateRange } from "../../../helpars/filterByDate";
import emailSender from "../../../helpars/emailSender";
import { createOtpEmailTemplate } from "../../../utils/createOtpEmailTemplate";

// create user
const createUser = async (payload: any) => {
  // check if email exists
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  // create user with inactive status
  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
      status: UserStatus.INACTIVE,
    },
  });

  // generate OTP
  const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
  // 5 minutes
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  // prepare email html
  const html = createOtpEmailTemplate(randomOtp);

  // send email
  await emailSender("OTP Verification", user.email, html);

  // update user with OTP + expiry
  await prisma.user.update({
    where: { id: user.id },
    data: { otp: randomOtp, otpExpiry },
  });

  return {
    message: "OTP sent to your email",
    email: user.email,
  };
};

export const UserService = {
  createUser,
};
