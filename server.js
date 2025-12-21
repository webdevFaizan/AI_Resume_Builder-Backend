import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';
import { ResumeMasterAPI } from './controller/ResumeController.js';
import { UserMasterAPI } from './controller/UserController.js';

const app = express();
let PORT = process.env.PORT || 3000;

await connectDB(); 

// CORS configuration to allow only specific frontend URL
const corsOptions = {
  origin: 'http://localhost:5173', // Allow only the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true, // Allow cookies (optional)
};

app.use(express.json());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.send("Application is live");
    console.log("On the home url")
});
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);
app.get('/resume/masterAPI', ResumeMasterAPI);
app.get('/user/masterAPI', UserMasterAPI);

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT : ${PORT}`)
});