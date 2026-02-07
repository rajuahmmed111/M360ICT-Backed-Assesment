import { Router } from 'express';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { validateRequest } from '../../middleware/validateRequest';
import { createAttendanceSchema, updateAttendanceSchema, attendanceQuerySchema } from './attendance.validation';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const attendanceService = new AttendanceService();
const attendanceController = new AttendanceController(attendanceService);

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /attendance - List attendance entries with filters
router.get('/', validateRequest(attendanceQuerySchema, 'query'), attendanceController.getAllAttendance.bind(attendanceController));

// GET /attendance/:id - Get a single attendance entry
router.get('/:id', attendanceController.getAttendanceById.bind(attendanceController));

// POST /attendance - Create or upsert attendance
router.post('/', validateRequest(createAttendanceSchema), attendanceController.createOrUpdateAttendance.bind(attendanceController));

// PUT /attendance/:id - Update an attendance entry
router.put('/:id', validateRequest(updateAttendanceSchema), attendanceController.updateAttendance.bind(attendanceController));

// DELETE /attendance/:id - Delete an attendance entry
router.delete('/:id', attendanceController.deleteAttendance.bind(attendanceController));

export { router as attendanceRoutes };
