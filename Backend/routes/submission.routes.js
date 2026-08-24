import { Router } from "express";
import {
  confirmSubmission,
  getMySubmissions,
  getAllSubmissions,
} from "../controllers/submission.controllers.js";
import authMiddleware from "../middlewares/auth.middlewares.js";
import roleMiddleware from "../middlewares/role.middlewares.js";

const submission_router = Router();

submission_router.post("/confirm", authMiddleware, confirmSubmission);
submission_router.get("/my-submissions", authMiddleware, getMySubmissions);
submission_router.get(
  "/all",
  authMiddleware,
  roleMiddleware("admin"),
  getAllSubmissions,
);

export default submission_router;
