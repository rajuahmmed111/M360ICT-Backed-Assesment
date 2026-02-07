import { Request, Response } from 'express';
import { ReportsService } from './reports.service';
import { MonthlyReportQueryInput } from './reports.validation';

export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  async getMonthlyAttendanceReport(req: Request, res: Response): Promise<void> {
    try {
      const query: MonthlyReportQueryInput = req.query as any;
      const report = await this.reportsService.getMonthlyAttendanceReport(query);
      
      res.status(200).json({
        success: true,
        data: report,
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
