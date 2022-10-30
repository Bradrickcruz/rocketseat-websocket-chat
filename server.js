import express from 'express';
import { join } from 'path';
import http from 'http';
import { Server as ioServer } from 'socket.io';
import ejs from 'ejs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);
const io = new ioServer(server);

app.use(express.static(join(__dirname, 'public')));
app.set('views', join(__dirname, 'public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.render('index.html');
});

let messages = [];

io.on('connection', (socket) => {
  console.log(`socket conectado ${socket.id}`);

  socket.emit('previousMessages', messages);

  socket.on('sendMessage', (data) => {
    messages.push(data);
    socket.broadcast.emit('receivedMessage', data);
  });
});

server.listen(3000);
