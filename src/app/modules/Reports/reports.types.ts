export interface MonthlyAttendanceReport {
  employeeId: string;
  name: string;
  designation: string;
  daysPresent: number;
  timesLate: number;
}

export interface MonthlyReportQuery {
  month: string; // YYYY-MM
  employeeId?: string;
}

export interface MonthlyReportResponse {
  month: string;
  employeeId?: string;
  report: MonthlyAttendanceReport[];
  summary: {
    totalEmployees: number;
    totalDaysPresent: number;
    totalLateArrivals: number;
  };
}
