import { Request, Response } from 'express';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceInput, UpdateAttendanceInput, AttendanceQueryInput } from './attendance.validation';

export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  async createOrUpdateAttendance(req: Request, res: Response): Promise<void> {
    try {
      const attendanceData: CreateAttendanceInput = req.body;
      const attendance = await this.attendanceService.createOrUpdateAttendance(attendanceData);
      
      res.status(201).json({
        success: true,
        message: 'Attendance recorded successfully',
        data: attendance,
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

  async getAllAttendance(req: Request, res: Response): Promise<void> {
    try {
      const query: AttendanceQueryInput = req.query as any;
      const result = await this.attendanceService.getAllAttendance(query);
      
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

  async getAttendanceById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid attendance ID',
        });
        return;
      }

      const attendance = await this.attendanceService.getAttendanceById(id);
      
      if (!attendance) {
        res.status(404).json({
          success: false,
          message: 'Attendance record not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async updateAttendance(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid attendance ID',
        });
        return;
      }

      const updateData: UpdateAttendanceInput = req.body;
      const attendance = await this.attendanceService.updateAttendance(id, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Attendance updated successfully',
        data: attendance,
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

  async deleteAttendance(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid attendance ID',
        });
        return;
      }

      await this.attendanceService.deleteAttendance(id);
      
      res.status(200).json({
        success: true,
        message: 'Attendance deleted successfully',
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
