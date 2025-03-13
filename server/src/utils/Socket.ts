// Socket.ts
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import app from '../app'; // Import the app from app.ts

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Create HTTP server using the Express app
const server = http.createServer(app);

const allowedOrigins = process.env.ALLOW_ORIGIN?.split(',') || [
  'https://chat-app-851o.onrender.com',
];

// In your Socket.ts file
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

// Store connected users
const users: Record<string, string> = {};

export function getUserSoketId (userId:string){
  return users[userId]
}

// WebSocket Event Handling
io.on('connection', (socket) => {
  console.log(`⚡ New client connected: ${socket.id}`);
  const userId = socket.handshake.query.userId as string;
  if (userId) users[userId] = socket.id;

  io.emit('getOnlineUsers', Object.keys(users));

  socket.on('disconnect', () => {
    console.log(`⚠️ User disconnected: ${socket.id}`);
    delete users[userId];
    io.emit('getOnlineUsers', Object.keys(users));
  });
});

export { server, io };
