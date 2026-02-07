import { Employee as PrismaEmployee } from "@prisma/client";

export type Employee = PrismaEmployee;

export type IEmployeeFilterRequest = {
  searchTerm?: string;
  name?: string;
};

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

export interface EmployeeListResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: Employee[];
}
