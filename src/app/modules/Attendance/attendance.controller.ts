import { Request, Response } from "express";
import { AttendanceService } from "./attendance.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import { pick } from "../../../shared/pick";

// create or update attendance
const createOrUpdateAttendance = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AttendanceService.createOrUpdateAttendance(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Attendance recorded successfully",
      data: result,
    });
  },
);

// get all attendance with pagination
const getAllAttendance = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, paginationFields);

  const filters = pick(req.query, ["employee_id", "date", "from", "to"]);

  const result = await AttendanceService.getAllAttendance(
    options,
    filters
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attendances fetched successfully",
    data: result,
  });
});


// get attendance by id
const getAttendanceById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AttendanceService.getAttendanceById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attendance fetched successfully",
    data: result,
  });
});

// update attendance
const updateAttendance = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AttendanceService.updateAttendance(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attendance updated successfully",
    data: result,
  });
});

// delete attendance
const deleteAttendance = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AttendanceService.deleteAttendance(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attendance deleted successfully",
    data: result,
  });
});

export const AttendanceController = {
  createOrUpdateAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
};
