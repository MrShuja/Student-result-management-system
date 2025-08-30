import express from 'express';
import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice
} from '../controllers/noticeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getNotices)
  .post(protect, admin, createNotice);

router.route('/:id')
  .put(protect, admin, updateNotice)
  .delete(protect, admin, deleteNotice);

export default router;