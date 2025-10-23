import Chat from '../models/Chat.js';

export const accessChat = async (req, res) => {
  const { userId } = req.body; // user you want to chat with

  if (!userId) return res.status(400).json({ message: 'UserId required' });

  let chat = await Chat.findOne({ isGroupChat: false, users: { $all: [req.user._id, userId] } })
    .populate('users', '-password')
    .populate('latestMessage');

  if (!chat) {
    chat = await Chat.create({ isGroupChat: false, users: [req.user._id, userId] });
    chat = await Chat.findById(chat._id).populate('users', '-password');
  }

  res.json(chat);
};

export const fetchChats = async (req, res) => {
  const chats = await Chat.find({ users: { $in: [req.user._id] } })
    .populate('users', '-password')
    .populate('latestMessage')
    .sort({ updatedAt: -1 });
    console.log(chats[0]['users']);
  res.json(chats);
};

export const fetchChatById = async (req, res) => {
  const { id } = req.params;
  const chat = await Chat.findById(id)
    .populate('users', '-password')
    .populate('latestMessage');
  if (!chat) return res.status(404).json({ message: 'Chat not found' });
  res.json(chat);
}

export const createGroupChat = async (req, res) => {
  const { name, userIds } = req.body; // userIds: array of IDs including self
  if (!name || !userIds || userIds.length < 2)
    return res.status(400).json({ message: 'Invalid data' });

  const chat = await Chat.create({
    chatName: name,
    isGroupChat: true,
    users: userIds,
    groupAdmin: req.user._id
  });

  const fullChat = await Chat.findById(chat._id).populate('users', '-password').populate('groupAdmin', '-password');
  res.json(fullChat);
};
