const WebSocket = require('ws').WebSocket;
const http = require('http');
const express = require('express');
const arduino = require('./utils/arduino');

// Server setup:
const app = express();
const port = 3000;
const server = http.createServer(app);
const ws = new WebSocket.Server({server});

server.listen(port, () => {
  console.log(`Server running on port ${server.address().port}`);
});

/**
 * Statuscodes:
 *  100: server ready for connection
 *  200: serialport connection open
 *  400: serialport connection closed
 *  410: Error during connection atempt
 */
 arduino.onReady((sp, parser) => {         // Connection to Arduino via serialport
  ws.on('connection', async (ws) => {      // Connect to Websocket
    const sendConnectionStatus = (err, code, callback = () => {}) => {
      if (err) {
        console.log(err.message)
        ws.send(410);
      } else {
        ws.send(Number.parseInt(code));
      }
    };
    const sendReadyStatus = () => ws.send(100);

    sendReadyStatus();

    // Listen for messages from clientside
    ws.on('message', (message) => {
      const open = (code, callback = () => {}) => sp.open((err) => sendConnectionStatus(err, code, callback));
      const close = (code) => sp.close((err) => sendConnectionStatus(err, code));

      switch (message.toString()) {
        case "OPEN":      open(200);
        case "CLOSE":     close(400);
        default:          sp.write(message);
      };
    });

    parser.on('data', data => {
      console.log(`Arduino send -> ${data}`);
      ws.send(data);
    });
  });
});