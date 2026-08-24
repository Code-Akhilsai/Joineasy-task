import { Router } from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { getMyProfile } from "../controllers/user.controllers.js";

const user_router = Router();

user_router.get("/profile", authMiddleware, getMyProfile);

export default user_router;
