import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js';
import authroutes from './routes/authRoutes.js';
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();

//  CORS setup: Correct origin, spelling, a and remove '*'
const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins[0],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// API Endpoints
app.get('/', (req, res) => {
  res.send(" API is Working");
});
app.use('/api/auth', authroutes);
app.use('/api/user', userRouter);

// Start server
app.listen(port, () => {
  console.log(` Server started on http://localhost:${port}`);
});
