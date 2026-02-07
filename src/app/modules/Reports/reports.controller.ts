import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReportsService } from "./reports.service";
import { MonthlyReportQuery } from "./reports.types";

const getMonthlyAttendanceReport = catchAsync(
  async (req: Request, res: Response) => {

    const query: MonthlyReportQuery = {
      month: req.query.month as string,
      employeeId: req.query.employeeId as string | undefined,
    };

    const report = await ReportsService.getMonthlyAttendanceReport(query);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Monthly attendance report fetched successfully",
      data: report,
    });
  }
);

export const ReportsController = {
  getMonthlyAttendanceReport,
};
