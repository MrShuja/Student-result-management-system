import express from 'express';
import {
  getResults,
  getStudentResults,
  createResult,
  updateResult,
  deleteResult
} from '../controllers/resultController.js';
import { protect, faculty } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getResults)
  .post(protect, faculty, createResult);

router.route('/student/:studentId')
  .get(protect, getStudentResults);

router.route('/:id')
  .put(protect, faculty, updateResult)
  .delete(protect, faculty, deleteResult);

export default router;