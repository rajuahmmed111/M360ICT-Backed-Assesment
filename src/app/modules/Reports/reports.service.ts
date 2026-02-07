import { PrismaClient } from '@prisma/client';
import { MonthlyAttendanceReport, MonthlyReportQuery, MonthlyReportResponse } from './reports.types';

const prisma = new PrismaClient();

export class ReportsService {
  async getMonthlyAttendanceReport(query: MonthlyReportQuery): Promise<MonthlyReportResponse> {
    const { month, employeeId } = query;
    
    // Parse month to get start and end dates
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0); // Last day of the month

    // Build where clause
    const whereClause: any = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (employeeId) {
      whereClause.employeeId = employeeId;
    }

    // Get attendance records with employee data
    const attendanceRecords = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            designation: true,
          },
        },
      },
      orderBy: [
        { employee: { name: 'asc' } },
        { date: 'asc' },
      ],
    });

    // Group by employee and calculate metrics
    const employeeMap = new Map<number, MonthlyAttendanceReport>();

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

      // Check if late (after 9:45 AM)
      const checkInHour = record.checkInTime.getHours();
      const checkInMinute = record.checkInTime.getMinutes();
      const totalMinutes = checkInHour * 60 + checkInMinute;
      const lateThreshold = 9 * 60 + 45; // 9:45 AM in minutes

      if (totalMinutes > lateThreshold) {
        report.timesLate++;
      }
    }

    const report = Array.from(employeeMap.values());

    // Calculate summary
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
  }
}
