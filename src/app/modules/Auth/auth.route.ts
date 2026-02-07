import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = Router();


// user login
router.post(
  "/login",
  validateRequest(AuthValidation.loginSchema),
  AuthController.Login,
);

export const authRoutes = router;
