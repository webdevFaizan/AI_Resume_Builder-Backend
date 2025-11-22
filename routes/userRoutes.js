import express from 'express';
import { getUserById, getUserResumeById, loginUser, registerUser } from '../controller/UserController';
import { protect } from '../middlewares/authMiddlewares';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/data', protect, getUserById);
userRouter.get('/resume', protect, getUserResumeById);

export default userRouter;