import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeListResponse,
} from "./employee.types";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelpers } from "../../../helpars/paginationHelper";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";

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
): Promise<EmployeeListResponse> => {
  const { page, limit, skip } = paginationHelpers.calculatedPagination(options);

  // filters
  const filters: Prisma.EmployeeWhereInput = {
    deletedAt: null,
  };

  const result = await prisma.employee.findMany({
    where: filters, // filter apply
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.employee.count({
    where: filters,
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
  console.log(id)
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
