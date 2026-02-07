import { Request, Response } from "express";
import { ReportsService } from "./reports.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { MonthlyReportQuery } from "./reports.types";

// get monthly attendance report
const getMonthlyAttendanceReport = catchAsync(
  async (req: Request, res: Response) => {
    const query: MonthlyReportQuery = req.query as any;
    const report = await ReportsService.getMonthlyAttendanceReport(query);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Monthly attendance report fetched successfully",
      data: report,
    });
  },
);

export const ReportsController = {
  getMonthlyAttendanceReport,
};
