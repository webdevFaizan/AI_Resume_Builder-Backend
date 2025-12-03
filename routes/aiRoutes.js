import express from 'express';
import { protect } from '../middlewares/authMiddlewares.js';
import { enhanceCompleteResume, enhanceJobDescription, enhanceProfessionalSummary } from '../controller/aiController.js';

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-summary', protect, enhanceProfessionalSummary);
aiRouter.post('/enhance-job-description', protect, enhanceJobDescription);
aiRouter.post('/enhance-resume', protect, enhanceCompleteResume);

export default aiRouter;