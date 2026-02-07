import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import {
  MonthlyAttendanceReport,
  MonthlyReportQuery,
  MonthlyReportResponse,
} from "./reports.types";
import ApiError from "../../../errors/ApiErrors";

const LATE_HOUR = 9;
const LATE_MINUTE = 45;

const getMonthlyAttendanceReport = async (
  query: MonthlyReportQuery,
): Promise<MonthlyReportResponse> => {
  // month validation
  if (!query.month) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Month is required (YYYY-MM)");
  }

  if (!/^\d{4}-\d{2}$/.test(query.month)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Month must be in YYYY-MM format",
    );
  }

  const [yearStr, monthStr] = query.month.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);

  // range
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const attendances = await prisma.attendance.findMany({
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
      ...(query.employeeId && {
        employeeId: query.employeeId,
      }),
    },
    include: {
      employee: true,
    },
  });

  // group by employee
  const employeeMap: Record<string, MonthlyAttendanceReport> = {};

  let totalDaysPresent = 0;
  let totalLateArrivals = 0;

  attendances.forEach((attendance) => {
    const empId = attendance.employeeId;

    // initialize employee
    if (!employeeMap[empId]) {
      employeeMap[empId] = {
        employeeId: empId,
        name: attendance.employee.name,
        designation: attendance.employee.designation,
        daysPresent: 0,
        timesLate: 0,
      };
    }

    // days present count
    employeeMap[empId].daysPresent += 1;
    totalDaysPresent += 1;

    const checkIn = new Date(attendance.checkInTime);

    const hour = checkIn.getHours();
    const minute = checkIn.getMinutes();

    if (hour > LATE_HOUR || (hour === LATE_HOUR && minute > LATE_MINUTE)) {
      employeeMap[empId].timesLate += 1;
      totalLateArrivals += 1;
    }
  });

  const report = Object.values(employeeMap);

  return {
    month: query.month,
    employeeId: query.employeeId,
    report,
    summary: {
      totalEmployees: report.length,
      totalDaysPresent,
      totalLateArrivals,
    },
  };
};

export const ReportsService = {
  getMonthlyAttendanceReport,
};
