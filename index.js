import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';
import messageRoutes from './routes/message.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('setup', (userId) => {
    socket.join(userId);
    socket.emit('connected');
    console.log('User setup complete:', userId);
  })

  socket.on('join chat', (chatId) => socket.join(chatId));

  socket.on('typing', (chatId) => socket.in(chatId).emit('typing', chatId));
  socket.on('stop typing', (chatId) => socket.in(chatId).emit('stop typing', chatId));

  socket.on('new message', (msg) => {
    io.to(msg.chat._id).emit('message received', msg);
    console.log('New message in chat:', msg.chat._id);
  })

  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
