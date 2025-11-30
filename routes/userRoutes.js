import express from 'express';
import { registerUser, loginUser, getUserById, getUserResumeById } from '../controller/UserController.js';
import { protect } from '../middlewares/authMiddlewares.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/data', protect, getUserById);
userRouter.get('/resume', protect, getUserResumeById);

export default userRouter;