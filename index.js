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
    let parserCreated = false;
    // const interface = spawn("npm", ["run", "interface"]);
    // interface.on("spawn", (err) => {
    //     if (err) console.log(err);
    //     open("http://localhost:8080/", {});
    // });
    // TODO: data leak from eventlisteners when refreshing to many times.
    // On every refresh and connection to the websocket:
    ws.on("connection", async (ws) => {
        const c = new ConnectionHandler(ws, sp);

        // Listen for messages from clientside
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

        parser.on("data", (data) => {
            console.log(`Serial: ${data}`)
            ws.send(data.toString());
        });
    });
});


