import express, { Application } from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.ALLOW_ORIGIN || "http://localhost:5173", 
  },
});

// Store connected users
const users: Record<string, string> = {};

// WebSocket Event Handling
io.on("connection", (socket) => {
  console.log(`⚡ New client connected: ${socket.id}`);

  socket.on("join", (userId: string) => {
    users[userId] = socket.id;
    console.log(`✅ User ${userId} connected with socket ${socket.id}`);
  });

  socket.on("sendMessage", ({ sender, receiver, message }) => {
    console.log(`📩 Message from ${sender} to ${receiver}: ${message}`);
    if (users[receiver]) {
      io.to(users[receiver]).emit("receiveMessage", { sender, message });
    }
  });

  socket.on("disconnect", () => {
    console.log(`⚠️ User disconnected: ${socket.id}`);
    for (const userId in users) {
      if (users[userId] === socket.id) delete users[userId];
    }
  });
});

export { app, server, io };
