import { Router } from "express";
import { EmployeeController } from "./employee.controller";
import { EmployeeValidation } from "./employee.validation";
import multer from "multer";
import path from "path";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || "./uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// get all employees
router.get("/", EmployeeController.getAllEmployees);

// get employee by id
router.get("/:id", EmployeeController.getEmployeeById);

// create employee
router.post(
  "/",
  upload.single("photo"),
  validateRequest(EmployeeValidation.createEmployeeSchema),
  EmployeeController.createEmployee,
);

// update employee
router.put(
  "/:id",
  upload.single("photo"),
  validateRequest(EmployeeValidation.updateEmployeeSchema),
  EmployeeController.updateEmployee,
);

// delete employee
router.delete("/:id", EmployeeController.deleteEmployee);

export const employeeRoutes = router;
