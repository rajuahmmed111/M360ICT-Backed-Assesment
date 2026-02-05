import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { uploadFile } from "../../../helpars/fileUploader";
import { UserController } from "./user.controller";
import { UserRole } from "@prisma/client";
import { parseBodyData } from "../../middlewares/parseNestedJson";

const router = express.Router();

// create user
router.post(
  "/",
  validateRequest(userValidation.createUserZodSchema),
  UserController.createUser,
);

export const userRoute = router;
