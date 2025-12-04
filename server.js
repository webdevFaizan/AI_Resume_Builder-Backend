import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';

const app = express();
let PORT = process.env.PORT || 3000;

await connectDB(); 

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Application is live") );
app.use('/app/users', userRouter);
app.use('/app/resume', resumeRouter);
app.use('/api/ai', aiRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT : ${PORT}`)
});