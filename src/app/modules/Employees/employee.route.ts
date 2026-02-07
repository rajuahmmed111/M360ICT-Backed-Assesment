import { Router } from "express";
import { EmployeeController } from "./employee.controller";
import { EmployeeValidation } from "./employee.validation";
import validateRequest from "../../middlewares/validateRequest";
import { uploadFile } from "../../../helpars/fileUploader";
import { parseBodyData } from "../../middlewares/parseNestedJson";

const router = Router();

// get all employees
router.get("/", EmployeeController.getAllEmployees);

// get employee by id
router.get("/:id", EmployeeController.getEmployeeById);

// create employee
router.post(
  "/",
  uploadFile.photoPath,
  validateRequest(EmployeeValidation.createEmployeeSchema),
  parseBodyData,
  EmployeeController.createEmployee,
);

// update employee
router.patch(
  "/:id",
  uploadFile.photoPath,
  validateRequest(EmployeeValidation.updateEmployeeSchema),
  parseBodyData,
  EmployeeController.updateEmployee,
);

// delete employee
router.delete("/:id", EmployeeController.deleteEmployee);

export const employeeRoutes = router;
