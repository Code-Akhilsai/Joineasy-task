import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express();


const port = process.env.PORT;
app.use(express.json());
app.use(cookieParser())
app.use(cors());


app.listen(port, ()=>console.log("Server is running on port: 3000"))

