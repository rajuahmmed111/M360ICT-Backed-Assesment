import { PrismaClient } from '@prisma/client';
import { Attendance, CreateAttendanceDto, UpdateAttendanceDto, AttendanceQueryParams } from './attendance.types';

const prisma = new PrismaClient();

export class AttendanceService {
  async createOrUpdateAttendance(data: CreateAttendanceDto): Promise<Attendance> {
    const { employeeId, date, checkInTime } = data;

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Convert checkInTime string to time format
    const [hours, minutes] = checkInTime.split(':');
    const checkInDateTime = new Date(date);
    checkInDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Check if attendance record already exists for this employee and date
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: new Date(date),
        },
      },
    });

    if (existingAttendance) {
      // Update existing record
      return await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: { checkInTime: checkInDateTime },
      });
    } else {
      // Create new record
      return await prisma.attendance.create({
        data: {
          employeeId,
          date: new Date(date),
          checkInTime: checkInDateTime,
        },
      });
    }
  }

  async getAllAttendance(query: AttendanceQueryParams): Promise<{ 
    attendances: Attendance[]; 
    total: number; 
    page: number; 
    limit: number; 
  }> {
    const { employeeId, from, to, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (from || to) {
      where.date = {};
      if (from) where.date.gte = from;
      if (to) where.date.lte = to;
    }

    const [attendances, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        skip,
        take: limit,
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              designation: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      }),
      prisma.attendance.count({ where }),
    ]);

    return {
      attendances,
      total,
      page,
      limit,
    };
  }

  async getAttendanceById(id: number): Promise<Attendance | null> {
    return await prisma.attendance.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            designation: true,
          },
        },
      },
    });
  }

  async updateAttendance(id: number, data: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    const updateData: any = { ...data };

    if (data.checkInTime) {
      const [hours, minutes] = data.checkInTime.split(':');
      const checkInDateTime = new Date(attendance.date);
      checkInDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      updateData.checkInTime = checkInDateTime;
    }

    return await prisma.attendance.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteAttendance(id: number): Promise<void> {
    const attendance = await prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    await prisma.attendance.delete({
      where: { id },
    });
  }
}
