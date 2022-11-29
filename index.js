const WebSocket = require("ws").WebSocket;
const http = require("http");
const express = require("express");
const arduino = require("./utils/arduino");
const { ConnectionController } = require("./utils/connection");
const { KeyboardController } = require("./utils/keyboard");

// Server setup:
const app = express(); 
const port = 3000;
const server = http.createServer(app);
const ws = new WebSocket.Server({ server });
const keyboard = new KeyboardController();

server.listen(port, () => {
  console.log(`Server running on port ${server.address().port}`);
});

arduino.onReady((sp, parser) => {
    // Connection to Arduino via serialport
    let parserCreated = false;
    // BUG: data leak from eventlisteners when refreshing to many times.
    // On every refresh and connection to the websocket:
    ws.on("connection", async (ws) => {
        const c = new ConnectionController(ws, sp);

        // Listen for messages from clientside, send to Arduino
        ws.on("message", (message) => {
            console.log(`Client: ${message}`);
            switch (message.toString()) {
                case "OPEN":
                    c.openSerial();
                    break;
                case "CLOSE":
                    c.closeSerial()
                    break;
                default:
                    sp.write(message);
            }
        });

        // Recieve messages from arduino:
        parser.on("data", (data) => {
            console.log("Serial: " + data.toString())

            const input = data.toString().match(/^[a-zA-Z][0-9]/g);
            if(!input) return;

            const key = keyboard.mapping.find((key) => key.point == input );
            if (!key) return;

            keyboard.write(key.keystroke);
        });
    });
});


