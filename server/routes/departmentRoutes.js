import express from 'express';
import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '../controllers/departmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getDepartments)
  .post(protect, admin, createDepartment);

router.route('/:id')
  .get(protect, getDepartment)
  .put(protect, admin, updateDepartment)
  .delete(protect, admin, deleteDepartment);

export default router;