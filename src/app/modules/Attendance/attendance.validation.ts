import { z } from "zod";

const createAttendanceSchema = z.object({
  body: z.object({
    employeeId: z.string({ required_error: "Employee ID is required" }),
    date: z.coerce.date({ invalid_type_error: "Invalid date" }),
    checkInTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Check-in time must be in HH:MM 24-hour format",
    }),
  }),
});

const updateAttendanceSchema = z.object({
  body: z.object({
    employeeId: z.string().optional(),
    date: z.coerce.date().optional(),
    checkInTime: z
      .string()
      .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Check-in time must be in HH:MM 24-hour format",
      })
      .optional(),
  }),
});

export const AttendanceValidation = {
  createAttendanceSchema,
  updateAttendanceSchema,
};
