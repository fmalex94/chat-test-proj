import express from 'express';
import morgan from 'morgan';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { PORT } from './config.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: '*',
  },
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(morgan('dev'));
app.use(express.static(join(__dirname, '../chat-client/build')));

io.on('connection', (socket) => {
  socket.on('msg', (msg) => {
    console.log(msg);
    socket.broadcast.emit('msg', { msg, user: socket.id });
  });
});

server.listen(PORT);
console.log(`Server running on port ${PORT}`);
