import { z } from 'zod';

const createAttendanceSchema = z.object({
  employeeId: z.number().int().positive('Employee ID must be a positive integer'),
  date: z.coerce.date(),
  checkInTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Check-in time must be in HH:MM format (24-hour)',
  }),
});

const updateAttendanceSchema = z.object({
  employeeId: z.number().int().positive('Employee ID must be a positive integer').optional(),
  date: z.coerce.date().optional(),
  checkInTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Check-in time must be in HH:MM format (24-hour)',
  }).optional(),
});

export const AttendanceValidation = {
  createAttendanceSchema,
  updateAttendanceSchema,
};