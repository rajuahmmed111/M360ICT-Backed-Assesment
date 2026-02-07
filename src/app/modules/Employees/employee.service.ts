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

// create employee
const createEmployee = async (data: CreateEmployeeDto): Promise<Employee> => {
  return await prisma.employee.create({
    data: {
      ...data,
      salary: data.salary,
    },
  });
};

// get all employees
const getAllEmployees = async (
  options: IPaginationOptions,
): Promise<EmployeeListResponse> => {
  const { page, limit, skip } = paginationHelpers.calculatedPagination(options);

  const result = await prisma.employee.findMany({
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.employee.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// get employee by id
const getEmployeeById = async (id: string): Promise<Employee | null> => {
  const result = await prisma.employee.findUnique({
    where: { id },
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
      salary: data.salary ? data.salary : undefined,
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
  deleteEmployee,
};
