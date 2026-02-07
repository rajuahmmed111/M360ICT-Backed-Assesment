import { Request, Response } from "express";
import { EmployeeService } from "./employee.service";
import { UpdateEmployeeDto } from "./employee.types";
import { pick } from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import sendResponse from "../../../shared/sendResponse";
import { uploadFile } from "../../../helpars/fileUploader";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

// create employee
const createEmployee = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const file = req.file;

    if (!file?.path) {
      throw new Error("Employee photo is required");
    }

    const uploadResult = await uploadFile.uploadToCloudinary(file);

    if (!uploadResult?.secure_url) {
      throw new Error("Photo upload failed");
    }

    req.body.photoPath = uploadResult.secure_url;

    const result = await EmployeeService.createEmployee(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Employee created successfully",
      data: result,
    });
  },
);

// get all employees
const getAllEmployees = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const options = pick(req.query, paginationFields);

    const result = await EmployeeService.getAllEmployees(options);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Employees fetched successfully",
      data: result,
    });
  },
);

// get employee by id
const getEmployeeById = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    const result = await EmployeeService.getEmployeeById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Employee fetched successfully",
      data: result,
    });
  },
);

// update employee
const updateEmployee = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    const updateData: UpdateEmployeeDto = req.body;

    // handle file upload
    if (req.file) {
      const cloudinaryResult = await uploadFile.uploadToCloudinary(req.file);

      if (cloudinaryResult) {
        updateData.photoPath = cloudinaryResult.secure_url;
      }
    }

    const employee = await EmployeeService.updateEmployee(id, updateData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  },
);

// employee soft delete
const softDeleteEmployee = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    const result = await EmployeeService.softDeleteEmployee(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Employee deleted successfully",
      data: result,
    });
  },
);

// delete employee
const deleteEmployee = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    const result = await EmployeeService.deleteEmployee(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Employee deleted successfully",
      data: result,
    });
  },
);

export const EmployeeController = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  softDeleteEmployee,
  deleteEmployee,
};
