import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import pool from "../db/connectdb.js";
import register_router from "../routes/register.routes.js";
import login_router from "../routes/login.routes.js";
import submission_router from "../routes/submission.routes.js";
import group_router from "../routes/group.routes.js";
import user_router from "../routes/user.routes.js";
import assignment_router from "../routes/assignment.routes.js";
const app = express();
dotenv.config();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", register_router);
app.use("/api/auth", login_router);
app.use("/api/submissions", submission_router);
app.use("/api/groups", group_router);
app.use("/api/users", user_router);
app.use("/api/assignments", assignment_router);

app.listen(port, () => console.log("Server is running on port: 3000"));
