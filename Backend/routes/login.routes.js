import { Router } from "express";
import loginController from "../controllers/login.controllers.js";

const login_router = Router();

login_router.post("/login", loginController);

export default login_router;
