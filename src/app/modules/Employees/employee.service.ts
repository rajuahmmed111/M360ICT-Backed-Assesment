import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeListResponse,
  IEmployeeFilterRequest,
} from "./employee.types";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelpers } from "../../../helpars/paginationHelper";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { searchableFields } from "./employee.constant";

// create employee
const createEmployee = async (data: CreateEmployeeDto): Promise<Employee> => {
  return await prisma.employee.create({
    data: {
      name: data.name,
      age: Number(data.age),
      designation: data.designation,
      hiringDate: new Date(data.hiringDate),
      dateOfBirth: new Date(data.dateOfBirth),
      salary: Number(data.salary),
      photoPath: data.photoPath,
    },
  });
};

// get all employees
const getAllEmployees = async (
  options: IPaginationOptions,
  params: IEmployeeFilterRequest,
): Promise<EmployeeListResponse> => {
  const { page, limit, skip } = paginationHelpers.calculatedPagination(options);

  const { searchTerm } = params;

  const filters: Prisma.EmployeeWhereInput[] = [];

  // soft delete filter
  filters.push({
    deletedAt: null,
  });

  // text search
  if (searchTerm) {
    filters.push({
      OR: searchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const where: Prisma.EmployeeWhereInput =
    filters.length > 0 ? { AND: filters } : {};

  const result = await prisma.employee.findMany({
    where,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
  });

  const total = await prisma.employee.count({
    where,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// get employee by id (excluding soft-deleted)
const getEmployeeById = async (id: string): Promise<Employee | null> => {
  const result = await prisma.employee.findFirst({
    where: {
      id,
      deletedAt: null, // soft-deleted filter
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee not found");
  }

  return result;
};

// update employee
const updateEmployee = async (
  id: string,
  data: UpdateEmployeeDto,
): Promise<Employee> => {
  return await prisma.employee.update({
    where: { id },
    data: {
      ...data,
      age: data.age ? Number(data.age) : undefined,
      hiringDate: data.hiringDate ? new Date(data.hiringDate) : undefined,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      salary: data.salary ? data.salary : undefined,
    },
  });
};

// employee soft delete
const softDeleteEmployee = async (id: string): Promise<void> => {
  console.log(id);
  await prisma.employee.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};

// delete employee
const deleteEmployee = async (id: string): Promise<void> => {
  await prisma.employee.delete({
    where: { id },
  });
};

export const EmployeeService = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  softDeleteEmployee,
  deleteEmployee,
};
