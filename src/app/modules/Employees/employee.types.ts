import { Employee as PrismaEmployee } from '@prisma/client';

export type Employee = PrismaEmployee;

export interface CreateEmployeeDto {
  name: string;
  age: number;
  designation: string;
  hiringDate: Date;
  dateOfBirth: Date;
  salary: number;
  photoPath?: string;
}

export interface UpdateEmployeeDto {
  name?: string;
  age?: number;
  designation?: string;
  hiringDate?: Date;
  dateOfBirth?: Date;
  salary?: number;
  photoPath?: string;
}

export interface EmployeeQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}
