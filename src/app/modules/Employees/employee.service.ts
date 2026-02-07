import { PrismaClient } from '@prisma/client';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto, EmployeeQueryParams } from './employee.types';

const prisma = new PrismaClient();

export class EmployeeService {
  async createEmployee(data: CreateEmployeeDto): Promise<Employee> {
    return await prisma.employee.create({
      data: {
        ...data,
        salary: data.salary,
      },
    });
  }

  async getAllEmployees(query: EmployeeQueryParams): Promise<{ employees: Employee[]; total: number; page: number; limit: number }> {
    const { search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.employee.count({ where }),
    ]);

    return {
      employees,
      total,
      page,
      limit,
    };
  }

  async getEmployeeById(id: number): Promise<Employee | null> {
    return await prisma.employee.findUnique({
      where: { id },
    });
  }

  async updateEmployee(id: number, data: UpdateEmployeeDto): Promise<Employee> {
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    return await prisma.employee.update({
      where: { id },
      data: {
        ...data,
        salary: data.salary ? data.salary : undefined,
      },
    });
  }

  async deleteEmployee(id: number): Promise<void> {
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    await prisma.employee.delete({
      where: { id },
    });
  }
}
