import * as WebSocket from 'ws';
import { Data, Server } from 'ws';

const wss = new Server({ port: 8081 });

wss.on('connection', (ws: WebSocket) => {
  console.log('new connection established');

  ws.on('message', (message: Data) => {
    console.log('Received: ' + message);

    wss.clients.forEach((client: WebSocket) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('I lost a client');
  });
});
