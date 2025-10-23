import Message from '../models/Message.js';
import Chat from '../models/Chat.js';

export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) return res.status(400).json({ message: 'Invalid data' });

  let message = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId
  });

  message = await message.populate('sender', 'name email');
  message = await message.populate('chat');
  await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

  res.json(message);
};

export const fetchMessages = async (req, res) => {
  const { chatId } = req.params;
  const messages = await Message.find({ chat: chatId })
    .populate('sender', 'name email')
    .populate('chat');
  res.json(messages);
};
