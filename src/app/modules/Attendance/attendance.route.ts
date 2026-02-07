import { Router } from "express";
import { AttendanceController } from "./attendance.controller";
import { AttendanceService } from "./attendance.service";
import {
  createAttendanceSchema,
  updateAttendanceSchema,
  attendanceQuerySchema,
} from "./attendance.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

// get all attendance with pagination
router.get(
  "/",
  validateRequest(attendanceQuerySchema),
  AttendanceController.getAllAttendance,
);

// get attendance by id
router.get("/:id", AttendanceController.getAttendanceById);

// create or update an attendance entry
router.post(
  "/",
  validateRequest(createAttendanceSchema),
  AttendanceController.createOrUpdateAttendance,
);

// update an attendance entry
router.patch(
  "/:id",
  validateRequest(updateAttendanceSchema),
  AttendanceController.updateAttendance,
);

// delete an attendance entry
router.delete("/:id", AttendanceController.deleteAttendance);

export const attendanceRoutes = router;
