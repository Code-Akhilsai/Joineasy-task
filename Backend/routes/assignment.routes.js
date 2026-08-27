import { Router } from "express";

import authMiddleware from "../middlewares/auth.middlewares.js";

import {
  createAssignment,
  getAllAssignments,
  updateAssignment,
} from "../controllers/assignment.controllers.js";

import roleMiddleware from "../middlewares/role.middlewares.js";

const assignment_router = Router();

assignment_router.post(
  "/create",
  authMiddleware,
  roleMiddleware("admin"),
  createAssignment,
);

assignment_router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateAssignment,
);

assignment_router.get("/all", authMiddleware, getAllAssignments);

export default assignment_router;
