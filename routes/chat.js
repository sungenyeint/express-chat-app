import express from 'express';
import { accessChat, fetchChats, fetchChatById, createGroupChat } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', protect, accessChat); // 1-1 chat
router.get('/', protect, fetchChats);
router.get('/:id', protect, fetchChatById);
router.post('/group', protect, createGroupChat);

export default router;
