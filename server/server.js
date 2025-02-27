import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/task.js";

import session from "express-session";
import passport from "passport";
import connectDb from "./config/db.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(session({
	secret:  process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false } // Set `true` if using HTTPS
  }));

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(helmet());
app.use(cookieParser());
app.get("/api", (req,res)=>res.json({message:"Welcome to the API"}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api", taskRoutes);


app.listen(PORT, async () => {
    await connectDb(process.env.MONGO_URL)
    console.log(`server is started @ https://crud-9bdk.onrender.com/${PORT}`)
})
