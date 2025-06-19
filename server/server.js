import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';

const app = express();
const server = http.createServer(app);

//  Initialize socket.io
export const io = new Server(server, {
  cors: { origin: '*' },
});

//  Online users map
export const userSocketMap = {}; // { userId: socketId }

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  console.log('⚡ User Connected:', userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Broadcast current online users
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('❌ User Disconnected:', userId);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

//  Middleware
app.use(express.json({ limit: '4mb' }));
app.use(cors());

//  Routes
app.use('/api/status', (req, res) => res.send('Server is live 🚀'));
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

//  Connect DB and start server
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () =>
    console.log(`🚀 Server is running at http://localhost:${PORT}`)
  );
};

startServer();
