import {
  Attendance,
  CreateAttendanceDto,
  UpdateAttendanceDto,
  AttendanceListResponse,
} from "./attendance.types";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelpers } from "../../../helpars/paginationHelper";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";

// create or update attendance
const createOrUpdateAttendance = async (
  data: CreateAttendanceDto,
): Promise<Attendance> => {
  const { employeeId, date, checkInTime } = data;

  // check if employee exists
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  // convert checkInTime string to time format
  const [hours, minutes] = checkInTime.split(":");
  const checkInDateTime = new Date(date);
  checkInDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  // check if attendance already exists employee and date
  const existingAttendance = await prisma.attendance.findUnique({
    where: {
      employeeId_date: {
        employeeId,
        date: new Date(date),
      },
    },
  });

  if (existingAttendance) {
    // update existing
    return await prisma.attendance.update({
      where: { id: existingAttendance.id },
      data: { checkInTime: checkInDateTime },
    });
  } else {
    // create attendance
    return await prisma.attendance.create({
      data: {
        employeeId,
        date: new Date(date),
        checkInTime: checkInDateTime,
      },
    });
  }
};

// get all attendance with pagination
const getAllAttendance = async (
  options: IPaginationOptions,
): Promise<AttendanceListResponse> => {
  const { page, limit, skip } = paginationHelpers.calculatedPagination(options);

  const attendances = await prisma.attendance.findMany({
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.attendance.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: attendances,
  };
};

// getAttendanceById
const getAttendanceById = async (id: string): Promise<Attendance | null> => {
  const result = await prisma.attendance.findUnique({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Attendance record not found");
  }

  return result;
};

// updateAttendance
const updateAttendance = async (
  id: string,
  data: UpdateAttendanceDto,
): Promise<Attendance> => {
  const attendance = await prisma.attendance.findUnique({
    where: { id },
  });

  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUND, "Attendance record not found");
  }

  const updateData: any = { ...data };

  if (data.checkInTime) {
    const [hours, minutes] = data.checkInTime.split(":");
    const checkInDateTime = new Date(attendance.date);
    checkInDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    updateData.checkInTime = checkInDateTime;
  }

  return await prisma.attendance.update({
    where: { id },
    data: updateData,
  });
};

// deleteAttendance
const deleteAttendance = async (id: string): Promise<void> => {
  const attendance = await prisma.attendance.findUnique({
    where: { id },
  });

  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUND, "Attendance record not found");
  }

  await prisma.attendance.delete({
    where: { id },
  });
};

export const AttendanceService = {
  createOrUpdateAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
};
