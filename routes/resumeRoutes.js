import express from "express";
import { createResume, deleteResume, getAllResumeByUserId, getPublicResumeById, getResumeById, updateResume } from "../controller/ResumeController.js";
import { protect } from "../middlewares/authMiddlewares.js";
import { upload } from "../configs/multer.js";

const resumeRouter = express.Router();

resumeRouter.post('/createResume', protect, createResume);
resumeRouter.delete('/deleteResume/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:resumeId', getPublicResumeById);
resumeRouter.get('/allUserResumes', protect, getAllResumeByUserId);

// The string 'profilePic' in the upload.single('profilePic') method is the field name that refers to the key under which the uploaded file will be sent in the form request. This can be any valid string that corresponds to the form field name where the file will be uploaded.
resumeRouter.put('/update', upload.single('image'), protect, updateResume);

export default resumeRouter;