import { Request, Response } from "express";
import { EmployeeService } from "./employee.service";
import { CreateEmployeeDto, UpdateEmployeeDto } from "./employee.types";
import { pick } from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import sendResponse from "../../../shared/sendResponse";

// create employee
const createEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeData: CreateEmployeeDto = req.body;

    // Handle file upload if present
    if (req.file) {
      employeeData.photoPath = req.file.filename;
    }

    const employee = await EmployeeService.createEmployee(employeeData);

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

// get all employees
const getAllEmployees = async (req: Request, res: Response): Promise<void> => {
  const options = pick(req.query, paginationFields);

  const result = await EmployeeService.getAllEmployees(options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Employees fetched successfully",
    data: result,
  });
};

// get employee by id
const getEmployeeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
      return;
    }

    const employee = await EmployeeService.getEmployeeById(id);

    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// update employee
const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
      return;
    }

    const updateData: UpdateEmployeeDto = req.body;

    // Handle file upload if present
    if (req.file) {
      updateData.photoPath = req.file.filename;
    }

    const employee = await EmployeeService.updateEmployee(id, updateData);

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

// delete employee
const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
      return;
    }

    await EmployeeService.deleteEmployee(id);

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

export const EmployeeController = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
