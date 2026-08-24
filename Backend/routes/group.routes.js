import { Router } from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import {
  groupController,
  getMyGroup,
  addMember,
  getAllGroups,
} from "../controllers/group.controllers.js";
import roleMiddleware from "../middlewares/role.middlewares.js";

const group_router = Router();

group_router.post("/create", authMiddleware, groupController);

group_router.get(
  "/my-group",
  authMiddleware,
  roleMiddleware("student"),
  getMyGroup,
);

group_router.post("/add-member", authMiddleware, addMember);

group_router.get("/all", authMiddleware, roleMiddleware("admin"), getAllGroups);

export default group_router;
