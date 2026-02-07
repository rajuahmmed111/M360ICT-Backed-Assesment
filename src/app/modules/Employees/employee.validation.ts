import { z } from "zod";

const createEmployeeSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    age: z
      .number()
      .int()
      .min(18, "Age must be at least 18")
      .max(65, "Age must not exceed 65"),
    designation: z.string().min(2, "Designation is required"),
    hiringDate: z.coerce.date().refine((date) => date <= new Date(), {
      message: "Hiring date cannot be in the future",
    }),
    dateOfBirth: z.coerce.date().refine(
      (date) => {
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 65);
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() - 18);
        return date >= minDate && date <= maxDate;
      },
      {
        message: "Date of birth must be between 18 and 65 years ago",
      },
    ),
    salary: z.number().positive("Salary must be positive"),
  }),
});

const updateEmployeeSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    age: z
      .number()
      .int()
      .min(18, "Age must be at least 18")
      .max(65, "Age must not exceed 65")
      .optional(),
    designation: z.string().min(2, "Designation is required").optional(),
    hiringDate: z.coerce
      .date()
      .refine((date) => date <= new Date(), {
        message: "Hiring date cannot be in the future",
      })
      .optional(),
    dateOfBirth: z.coerce
      .date()
      .refine(
        (date) => {
          const minDate = new Date();
          minDate.setFullYear(minDate.getFullYear() - 65);
          const maxDate = new Date();
          maxDate.setFullYear(maxDate.getFullYear() - 18);
          return date >= minDate && date <= maxDate;
        },
        {
          message: "Date of birth must be between 18 and 65 years ago",
        },
      )
      .optional(),
    salary: z.number().positive("Salary must be positive").optional(),
  }),
});

export const EmployeeValidation = {
  createEmployeeSchema,
  updateEmployeeSchema,
};
