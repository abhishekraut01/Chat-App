import express, { Application } from "express";
import { Server } from "socket.io";
import http from "http";

const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Removed trailing slash (fix CORS issue)
    credentials: true,
  },
});

// WebSocket Event Handling
io.on("connection", (socket) => {
  console.log(`⚡ New client connected: ${socket.id}`);

  socket.on("join", (userId: string) => {
    console.log(`✅ User ${userId} connected with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log(`⚠️ User disconnected: ${socket.id}`);
  });
});

export { app, server, io };
