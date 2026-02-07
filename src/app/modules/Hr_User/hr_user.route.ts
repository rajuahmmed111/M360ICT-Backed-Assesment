import { Router } from "express";
import { createHrUserSchema, loginSchema } from "./hr_user.validation";
import validateRequest from "../../middlewares/validateRequest";
import { HrUserController } from "./hr_user.controller";

const router = Router();

// get hr user by id
router.get("/:id", HrUserController.getHrUserById);

// create HR user
router.post(
  "/register",
  validateRequest(createHrUserSchema),
  HrUserController.createHrUser,
);

// hr user login
router.post("/login", validateRequest(loginSchema), HrUserController.hrLogin);

export const hrUserRoutes = router;
