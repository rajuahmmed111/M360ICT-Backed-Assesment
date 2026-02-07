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
import { Prisma } from "@prisma/client";

// create or update attendance
const createOrUpdateAttendance = async (
  data: CreateAttendanceDto,
): Promise<any> => {
  const { employeeId, date, checkInTime } = data;

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee not found");
  }

  // Convert HH:MM → Date
  const isoCheckInTime = new Date(`1970-01-01T${checkInTime}:00Z`);

  const formatTimeTo12Hour = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const attendanceDate = new Date(`${date}T00:00:00Z`);

  const existingAttendance = await prisma.attendance.findUnique({
    where: {
      employeeId_date: {
        employeeId,
        date: attendanceDate,
      },
    },
  });

  if (existingAttendance) {
    const updatedAttendance = await prisma.attendance.update({
      where: { id: existingAttendance.id },
      data: { checkInTime: isoCheckInTime },
    });

    return {
      ...updatedAttendance,
      checkInTime: formatTimeTo12Hour(updatedAttendance.checkInTime),
    };
  }

  const newAttendance = await prisma.attendance.create({
    data: {
      employeeId,
      date: attendanceDate,
      checkInTime: isoCheckInTime,
    },
  });

  return {
    ...newAttendance,
    checkInTime: formatTimeTo12Hour(newAttendance.checkInTime),
  };
};

// get all attendance with pagination
const getAllAttendance = async (
  options: IPaginationOptions,
  params: any,
): Promise<AttendanceListResponse> => {
  const { page, limit, skip } = paginationHelpers.calculatedPagination(options);

  const { employee_id, date, from, to } = params;

  const filters: Prisma.AttendanceWhereInput[] = [];

  // employee filter
  if (employee_id) {
    filters.push({
      employeeId: employee_id,
    });
  }

// single date filter
if (date) {
  const selectedDate = new Date(date);
  selectedDate.setUTCHours(0, 0, 0, 0);

  filters.push({
    date: selectedDate,
  });
}


  // date range filter
  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);

    filters.push({
      date: {
        gte: fromDate,
        lte: toDate,
      },
    });
  }

  const where: Prisma.AttendanceWhereInput =
    filters.length > 0 ? { AND: filters } : {};

  const attendances = await prisma.attendance.findMany({
    where,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },

    include: {
      employee: true,
    },
  });

  const total = await prisma.attendance.count({
    where,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: attendances,
  };
};

// get attendance by id
const getAttendanceById = async (id: string): Promise<Attendance | null> => {
  const result = await prisma.attendance.findUnique({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Attendance record not found");
  }

  return result;
};

// update attendance
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

  const updateData: any = {};

  // update employeeId
  if (data.employeeId) {
    updateData.employeeId = data.employeeId;
  }

  // update date (IMPORTANT FIX)
  if (data.date) {
    const normalizedDate = new Date(data.date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    updateData.date = normalizedDate;
  }

  // update checkInTime
  if (data.checkInTime) {

    const [hours, minutes] = data.checkInTime.split(":");

    const baseDate = data.date
      ? new Date(data.date)
      : attendance.date;

    const checkInDateTime = new Date(baseDate);
    checkInDateTime.setUTCHours(
      parseInt(hours),
      parseInt(minutes),
      0,
      0
    );

    updateData.checkInTime = checkInDateTime;
  }

  return await prisma.attendance.update({
    where: { id },
    data: updateData,
  });
};

// delete attendance
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
