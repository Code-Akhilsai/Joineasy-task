import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors"
import pool from "../db/connectdb.js"
import register_router from "../routes/register.routes.js";
import login_router from "../routes/login.routes.js";

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

//routes

app.use("/api/auth",register_router);
app.use("/api/auth",login_router)


app.listen(port, ()=>console.log("Server is running on port: 3000"))

