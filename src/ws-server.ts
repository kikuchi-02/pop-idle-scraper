import { Server, Data } from 'ws';
import * as WebSocket from 'ws';

const server = new Server({ port: 8081 });

server.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: Data) => {
    console.log('Received: ' + message);

    server.clients.forEach((client: WebSocket) => {
      client.send(message);
    });
  });

  ws.on('close', () => {
    console.log('I lost a client');
  });
});
