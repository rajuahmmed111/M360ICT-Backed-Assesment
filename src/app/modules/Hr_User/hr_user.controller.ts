import { Request, Response } from "express";
import { HrUserService } from "./hr_user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

// create hr user
const createHrUser = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;
  const result = await HrUserService.createHrUser(userData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "HR user created successfully",
    data: result,
  });
});

// hr login
const hrLogin = catchAsync(async (req: Request, res: Response) => {
  const loginData = req.body;
  const result = await HrUserService.hrLogin(loginData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
});

// get hr user by id
const getHrUserById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;

  const user = await HrUserService.getHrUserById(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User found successfully",
    success: true,
    data: user,
  });
});

export const HrUserController = {
  createHrUser,
  hrLogin,
  getHrUserById,
};
