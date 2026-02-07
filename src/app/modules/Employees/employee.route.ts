import { Router } from 'express';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { validateRequest } from '../../middleware/validateRequest';
import { createEmployeeSchema, updateEmployeeSchema, employeeQuerySchema } from './employee.validation';
import { authMiddleware } from '../../middleware/auth';
import multer from 'multer';
import path from 'path';

const router = Router();
const employeeService = new EmployeeService();
const employeeController = new EmployeeController(employeeService);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /employees - List all employees with pagination and search
router.get('/', validateRequest(employeeQuerySchema, 'query'), employeeController.getAllEmployees.bind(employeeController));

// GET /employees/:id - Get a single employee by ID
router.get('/:id', employeeController.getEmployeeById.bind(employeeController));

// POST /employees - Create a new employee (supports file upload)
router.post('/', upload.single('photo'), validateRequest(createEmployeeSchema), employeeController.createEmployee.bind(employeeController));

// PUT /employees/:id - Update employee details (supports file upload)
router.put('/:id', upload.single('photo'), validateRequest(updateEmployeeSchema), employeeController.updateEmployee.bind(employeeController));

// DELETE /employees/:id - Delete an employee
router.delete('/:id', employeeController.deleteEmployee.bind(employeeController));

export { router as employeeRoutes };
