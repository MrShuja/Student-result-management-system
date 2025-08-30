import express from 'express';
import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
} from '../controllers/studentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getStudents)
  .post(protect, admin, createStudent);

router.route('/:id')
  .get(protect, getStudent)
  .put(protect, admin, updateStudent)
  .delete(protect, admin, deleteStudent);

export default router;