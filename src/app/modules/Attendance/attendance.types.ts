import { Attendance as PrismaAttendance } from "@prisma/client";

export type Attendance = PrismaAttendance;

export interface CreateAttendanceDto {
  employeeId: string;
  date: Date;
  checkInTime: string; // HH:MM format
}

export interface UpdateAttendanceDto {
  employeeId?: string;
  date?: Date;
  checkInTime?: string;
}

export interface AttendanceListResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: Attendance[];
}
