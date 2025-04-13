import { WebSocketServer } from 'ws';
import * as storage from './storage.js';

const port = process.env.WS_PORT || 3333;
const server = new WebSocketServer({ port });
console.log('started server on port', port);

const updateEveryone = () => {
  server.clients.forEach((client) => client.send(JSON.stringify({ type: 'all sounds', sounds: storage.sounds })));
};

server.on('connection', (socket) => {
  console.info('new connection');
  socket.send(JSON.stringify({ type: 'all sounds', sounds: storage.sounds }));

  const interval = setInterval(() => {
    socket.send('{ "type": "still there" }');
  });

  socket.on('close', () => {
    clearInterval(interval);
  });

  socket.on('message', (message) => {
    console.info('received message', message.toString());
    if (message.toString() === 'ping') {
      return socket.send('pong');
    }

    const data = JSON.parse(message);

    switch (data.type) {
      case 'update sounds':
        const { type, sounds } = data;
        storage.update(sounds);
        updateEveryone();
        break;
      default:
        console.warn('Unknown WS message type:', data.type);
        return;
    }
  });
});
