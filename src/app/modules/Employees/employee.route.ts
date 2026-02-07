import { Router } from "express";
import { EmployeeController } from "./employee.controller";
import { EmployeeValidation } from "./employee.validation";
import validateRequest from "../../middlewares/validateRequest";
import { uploadFile } from "../../../helpars/fileUploader";
import { parseBodyData } from "../../middlewares/parseNestedJson";
import auth from "../../middlewares/auth";

const router = Router();

// get all employees
router.get("/", EmployeeController.getAllEmployees);

// get employee by id
router.get("/:id", EmployeeController.getEmployeeById);

// create employee
router.post(
  "/",
  auth(),
  uploadFile.photoPath,
  parseBodyData,
  validateRequest(EmployeeValidation.createEmployeeSchema),
  EmployeeController.createEmployee,
);

// update employee
router.patch(
  "/:id",
  auth(),
  uploadFile.photoPath,
  parseBodyData,
  validateRequest(EmployeeValidation.updateEmployeeSchema),
  EmployeeController.updateEmployee,
);

// employee soft delete
router.patch("/soft-delete/:id", auth(), EmployeeController.softDeleteEmployee);

// delete employee
router.delete("/:id", auth(), EmployeeController.deleteEmployee);

export const employeeRoutes = router;
