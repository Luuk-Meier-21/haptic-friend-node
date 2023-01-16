import { WebSocket } from "ws";
import { createServer } from "http";
import express from "express";

import arduino from "./utils/arduino"

import { SettingsController } from "./utils/settings";
import { ConnectionController } from "./utils/connection";
import { ReadlineParser, SerialPort } from "serialport";
// const { KeyboardController } = require("./utils/keyboard");

const app = express(); 
const port = 3000;
const server = createServer(app);
const settings = new SettingsController("hpf-settings");

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Connection to arduino was made:
const onArduinoConnection = () => {
    settings.get();
}

// Message was send from arduino:
const onArduinoMessage = (data: string) => {
    console.log(data.toString())
}

// // Connection to websocket was made:
// const onWebsocketConnection = () => {
//     console.log("hi")
// }

// Message from websocket:
const onWebsocketMessage = (message: string, c: ConnectionController) => {
    switch (message.toString()) {
        case "OPEN":
            c.openSerial();
            break;
        case "CLOSE":
            c.closeSerial()
            break;
        default:
            c.sendSerial(message);
    }
}

arduino.onReady((sp: SerialPort, parser: ReadlineParser) => {
    const ws = new WebSocket.Server({ server });
    ws.removeAllListeners();
    onArduinoConnection();
    ws.on("connection", (ws: WebSocket) => {
        const c = new ConnectionController(ws, sp);

        ws.on("message", (message: string) => 
            onWebsocketMessage(message, c)
        );

        parser.removeAllListeners();
        parser.on("data", (data) => 
            onArduinoMessage(data)
        );
    });
});

// PRoGrAMmINg; (PerformanceNavigationTiming.bind)




