export interface MonthlyAttendanceReport {
  employeeId: number;
  name: string;
  designation: string;
  daysPresent: number;
  timesLate: number;
}

export interface MonthlyReportQuery {
  month: string; // YYYY-MM format
  employeeId?: number;
}

export interface MonthlyReportResponse {
  month: string;
  employeeId?: number;
  report: MonthlyAttendanceReport[];
  summary: {
    totalEmployees: number;
    totalDaysPresent: number;
    totalLateArrivals: number;
  };
}
