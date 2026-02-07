import {
  MonthlyAttendanceReport,
  MonthlyReportQuery,
  MonthlyReportResponse,
} from "./reports.types";
import prisma from "../../../shared/prisma";

// get monthly attendance report
const getMonthlyAttendanceReport = async (
  query: MonthlyReportQuery,
): Promise<MonthlyReportResponse> => {
  const { month, employeeId } = query;

  // parse month to get start and end dates
  const [year, monthNum] = month.split("-").map(Number);
  const startDate = new Date(year, monthNum - 1, 1);
  const endDate = new Date(year, monthNum, 0); // Last day of the month

  // Build where clause
  const where: any = {
    date: {
      gte: startDate,
      lte: endDate,
    },
  };

  if (employeeId) {
    where.employeeId = employeeId;
  }

  // get attendance employee data
  const attendanceRecords = await prisma.attendance.findMany({
    where: where,
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          designation: true,
        },
      },
    },
    orderBy: [{ employee: { name: "asc" } }, { date: "asc" }],
  });

  // group by employee
  const employeeMap = new Map<string, MonthlyAttendanceReport>();

  for (const record of attendanceRecords) {
    const empId = record.employee.id;

    if (!employeeMap.has(empId)) {
      employeeMap.set(empId, {
        employeeId: empId,
        name: record.employee.name,
        designation: record.employee.designation,
        daysPresent: 0,
        timesLate: 0,
      });
    }

    const report = employeeMap.get(empId)!;
    report.daysPresent++;

    // check if late (after 9:45 AM)
    const checkInHour = record.checkInTime.getHours();
    const checkInMinute = record.checkInTime.getMinutes();
    const totalMinutes = checkInHour * 60 + checkInMinute;
    const lateThreshold = 9 * 60 + 45; // 9:45 AM in minutes

    if (totalMinutes > lateThreshold) {
      report.timesLate++;
    }
  }

  const report = Array.from(employeeMap.values());

  // calculate summary
  const summary = {
    totalEmployees: report.length,
    totalDaysPresent: report.reduce((sum, emp) => sum + emp.daysPresent, 0),
    totalLateArrivals: report.reduce((sum, emp) => sum + emp.timesLate, 0),
  };

  return {
    month,
    employeeId,
    report,
    summary,
  };
};

export const ReportsService = {
  getMonthlyAttendanceReport,
};
