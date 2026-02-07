import { z } from 'zod';

export const monthlyReportQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'Month must be in YYYY-MM format',
  }),
  employeeId: z.coerce.number().int().positive().optional(),
});

export type MonthlyReportQueryInput = z.infer<typeof monthlyReportQuerySchema>;
