import express from 'express';
import { accessChat, fetchChats, fetchChatById, createGroupChat, renameGroupChat, addToGroupChat, removeFromGroupChat, deleteChat } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', protect, accessChat); // 1-1 chat
router.get('/', protect, fetchChats);
router.get('/:id', protect, fetchChatById);
router.post('/group', protect, createGroupChat);
router.put('/rename', protect, renameGroupChat);
router.put('/add-to-group', protect, addToGroupChat);
router.put('/remove-from-group', protect, removeFromGroupChat);
router.delete('/', protect, deleteChat);

export default router;
