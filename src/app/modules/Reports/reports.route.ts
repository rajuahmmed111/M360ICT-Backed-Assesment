import { Router } from "express";
import { ReportsController } from "./reports.controller";

const router = Router();

// get monthly attendance report
router.get("/attendance", ReportsController.getMonthlyAttendanceReport);

export const reportsRoutes = router;
