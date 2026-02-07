import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { validateRequest } from '../../middleware/validateRequest';
import { monthlyReportQuerySchema } from './reports.validation';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const reportsService = new ReportsService();
const reportsController = new ReportsController(reportsService);

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /reports/attendance - Monthly attendance summary
router.get('/attendance', validateRequest(monthlyReportQuerySchema, 'query'), reportsController.getMonthlyAttendanceReport.bind(reportsController));

export { router as reportsRoutes };
