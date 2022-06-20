const WebSocket = require("ws").WebSocket;
const http = require("http");
const express = require("express");
const arduino = require("./utils/arduino");
const { ActionsController } = require("./utils/game");
const { ConnectionHandler } = require("./utils/connection");
const open = require('open');
const { spawn } = require("child_process");

// Server setup:
const app = express(); 
const port = 3000;
const interfacePort = 8080;
const server = http.createServer(app);
const ws = new WebSocket.Server({ server });

server.listen(port, () => {
  console.log(`Server running on port ${server.address().port}`);
});

arduino.onReady((sp, parser) => {
    // Connection to Arduino via serialport

    const interface = spawn("npm", ["run", "interface"]);

    interface.on("spawn", () => {
        open("http://localhost:8080/");
    });

    ws.on("connection", async (ws) => {
        const c = new ConnectionHandler(ws, sp);
        console.log(c.isOpen());

        // Listen for messages from clientside
        ws.on("message", (message) => {
            
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

        // Listen for messages from serialport
        parser.on("data", (data) => {
            ws.send(data.toString());
        });
    });
});
