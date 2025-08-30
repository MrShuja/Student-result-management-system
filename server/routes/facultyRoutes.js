import express from 'express';
import {
  getFaculty,
  getFacultyMember,
  createFaculty,
  updateFaculty,
  deleteFaculty
} from '../controllers/facultyController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getFaculty)
  .post(protect, admin, createFaculty);

router.route('/:id')
  .get(protect, getFacultyMember)
  .put(protect, admin, updateFaculty)
  .delete(protect, admin, deleteFaculty);

export default router;