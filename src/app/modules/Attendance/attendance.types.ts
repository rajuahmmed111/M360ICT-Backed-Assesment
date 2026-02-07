import { Attendance as PrismaAttendance } from '@prisma/client';

export type Attendance = PrismaAttendance;

export interface CreateAttendanceDto {
  employeeId: number;
  date: Date;
  checkInTime: string; // HH:MM format
}

export interface UpdateAttendanceDto {
  employeeId?: number;
  date?: Date;
  checkInTime?: string;
}

export interface AttendanceQueryParams {
  employeeId?: number;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}
