import {Router} from "express";
import registerController from "../controllers/register.controllers.js";

const register_router = Router();

register_router.post("/register", registerController);

export default register_router;