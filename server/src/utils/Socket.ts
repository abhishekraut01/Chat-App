import express, { Application } from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app:Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173/'],
  },
});

export { io, server, app };
