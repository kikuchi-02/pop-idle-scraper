"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var server = new ws_1.Server({ port: 8081 });
server.on('connection', function (ws) {
    ws.on('message', function (message) {
        console.log('Received: ' + message);
        server.clients.forEach(function (client) {
            client.send(message);
        });
    });
    ws.on('close', function () {
        console.log('I lost a client');
    });
});
