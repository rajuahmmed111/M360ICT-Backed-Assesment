import { z } from 'zod';

export const createAttendanceSchema = z.object({
  employeeId: z.number().int().positive('Employee ID must be a positive integer'),
  date: z.coerce.date(),
  checkInTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Check-in time must be in HH:MM format (24-hour)',
  }),
});

export const updateAttendanceSchema = z.object({
  employeeId: z.number().int().positive('Employee ID must be a positive integer').optional(),
  date: z.coerce.date().optional(),
  checkInTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Check-in time must be in HH:MM format (24-hour)',
  }).optional(),
});

export const attendanceQuerySchema = z.object({
  employeeId: z.coerce.number().int().positive().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
}).refine((data) => {
  if (data.from && data.to && data.from > data.to) {
    return false;
  }
  return true;
}, {
  message: 'From date must be before or equal to to date',
  path: ['from'],
});

export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type AttendanceQueryInput = z.infer<typeof attendanceQuerySchema>;
