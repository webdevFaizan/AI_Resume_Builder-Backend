import express from 'express';
import { getUserById, loginUser, registerUser } from '../controller/UserController';
import { protect } from '../middlewares/authMiddlewares';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/data', protect, getUserById);

export default userRouter;