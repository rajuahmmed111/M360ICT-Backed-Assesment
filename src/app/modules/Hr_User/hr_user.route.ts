import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { HrUserController } from "./hr_user.controller";
import { HrUserValidation } from "./hr_user.validation";
import auth from "../../middlewares/auth";

const router = Router();

// get hr user by id
router.get("/:id", auth(), HrUserController.getHrUserById);

// create HR user
router.post(
  "/register",
  validateRequest(HrUserValidation.createHrUserSchema),
  HrUserController.createHrUser,
);

export const hrUserRoutes = router;
