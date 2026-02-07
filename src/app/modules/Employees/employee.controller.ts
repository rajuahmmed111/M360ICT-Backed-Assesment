import { Request, Response } from 'express';
import { EmployeeService } from './employee.service';
import { CreateEmployeeInput, UpdateEmployeeInput, EmployeeQueryInput } from './employee.validation';

export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  async createEmployee(req: Request, res: Response): Promise<void> {
    try {
      const employeeData: CreateEmployeeInput = req.body;
      
      // Handle file upload if present
      if (req.file) {
        employeeData.photoPath = req.file.filename;
      }

      const employee = await this.employeeService.createEmployee(employeeData);
      
      res.status(201).json({
        success: true,
        message: 'Employee created successfully',
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
          message: 'Internal server error',
        });
      }
    }
  }

  async getAllEmployees(req: Request, res: Response): Promise<void> {
    try {
      const query: EmployeeQueryInput = req.query as any;
      const result = await this.employeeService.getAllEmployees(query);
      
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getEmployeeById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid employee ID',
        });
        return;
      }

      const employee = await this.employeeService.getEmployeeById(id);
      
      if (!employee) {
        res.status(404).json({
          success: false,
          message: 'Employee not found',
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
        message: 'Internal server error',
      });
    }
  }

  async updateEmployee(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid employee ID',
        });
        return;
      }

      const updateData: UpdateEmployeeInput = req.body;
      
      // Handle file upload if present
      if (req.file) {
        updateData.photoPath = req.file.filename;
      }

      const employee = await this.employeeService.updateEmployee(id, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Employee updated successfully',
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
          message: 'Internal server error',
        });
      }
    }
  }

  async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid employee ID',
        });
        return;
      }

      await this.employeeService.deleteEmployee(id);
      
      res.status(200).json({
        success: true,
        message: 'Employee deleted successfully',
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
          message: 'Internal server error',
        });
      }
    }
  }
}
