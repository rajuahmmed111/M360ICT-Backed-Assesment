import { Router } from "express";
import { AttendanceController } from "./attendance.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AttendanceValidation } from "./attendance.validation";

const router = Router();

// get all attendance with pagination
router.get("/", AttendanceController.getAllAttendance);

// get attendance by id
router.get("/:id", AttendanceController.getAttendanceById);

// create or update attendance
router.post(
  "/",
  validateRequest(AttendanceValidation.createAttendanceSchema),
  AttendanceController.createOrUpdateAttendance,
);

// update attendance
router.patch(
  "/:id",
  validateRequest(AttendanceValidation.updateAttendanceSchema),
  AttendanceController.updateAttendance,
);

// delete attendance
router.delete("/:id", AttendanceController.deleteAttendance);

export const attendanceRoutes = router;
