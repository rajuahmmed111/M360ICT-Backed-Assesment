import express from "express";

import { hrUserRoutes } from "../modules/Hr_User/hr_user.route";
import { employeeRoutes } from "../modules/Employees/employee.route";
import { attendanceRoutes } from "../modules/Attendance/attendance.route";
import { reportsRoutes } from "../modules/Reports/reports.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/hr",
    route: hrUserRoutes,
  },
  {
    path: "/employees",
    route: employeeRoutes,
  },
  {
    path: "/attendance",
    route: attendanceRoutes,
  },
  {
    path: "/reports",
    route: reportsRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
