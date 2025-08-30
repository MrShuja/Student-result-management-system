import express from 'express';
import {
  generateTranscript,
  getTranscript
} from '../controllers/transcriptController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:studentId')
  .get(protect, getTranscript)
  .post(protect, generateTranscript);

export default router;