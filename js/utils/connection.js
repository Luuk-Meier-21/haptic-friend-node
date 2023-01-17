"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionController = void 0;
const tslib_1 = require("tslib");
const ws_1 = tslib_1.__importDefault(require("ws"));
const http_1 = tslib_1.__importDefault(require("http"));
const express_1 = tslib_1.__importDefault(require("express"));
const serail_1 = require("./serail");
const nullFunc = () => { };
class ConnectionController {
    onSerialOpenArray = [];
    onSerialOpen = nullFunc;
    onSerialMessage = nullFunc;
    onWebSocketOpen = nullFunc;
    onWebSocketMessage = nullFunc;
    serial;
    webSocketServer;
    webSocket;
    server;
    port = 3000;
    constructor() {
        const app = (0, express_1.default)();
        this.server = http_1.default.createServer(app);
    }
    start = () => {
        const callEach = (funcArray, param) => {
            for (let i = 0; i < funcArray.length; i++) {
                if (param)
                    funcArray[i](param);
                else
                    funcArray[i]();
            }
        };
        (0, serail_1.readySerial)((serial, parser) => {
            this.serial = serial;
            callEach(this.onSerialOpenArray);
            this.onSerialOpen();
            const server = this.server;
            this.webSocketServer = new ws_1.default.Server({ server });
            this.webSocketServer.on("connection", (ws) => {
                this.onWebSocketOpen();
                this.webSocket = ws;
                // Flush listeners:
                this.webSocket.removeAllListeners();
                parser.removeAllListeners();
                // WebSocket messages:
                this.webSocket.on("message", (message) => {
                    this.onWebSocketMessage(message);
                });
                // Serial messages:
                parser.on("data", (data) => {
                    this.onSerialMessage(data);
                });
            });
        });
    };
    listen = () => {
        this.server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    };
    sendSerial = (data) => {
        if (this.serial) {
            this.serial.write(data);
        }
        else {
            throw Error("Function (sendSerial) called before a serialport object was made available.");
        }
    };
    sendSocket = (data) => {
        if (this.webSocket) {
            this.webSocket.send(data);
        }
        else {
            throw Error("Function (webSocket) called before a webSocket object was made available.");
        }
    };
    setSerialListener = (type, listener) => {
        switch (type) {
            case "open":
                this.onSerialOpen = listener;
                break;
            case "message":
                this.onSerialMessage = listener;
                break;
        }
    };
    setWebSocketListener = (type, listener) => {
        switch (type) {
            case "open":
                this.onWebSocketOpen = listener;
                break;
            case "message":
                this.onWebSocketMessage = listener;
                break;
        }
    };
}
exports.ConnectionController = ConnectionController;
// wss.on('connection', (ws: ExtwebSocket) => {
//     ws.isAlive = true;
//     ws.on('pong', () => {
//         ws.isAlive = true;
//     });
//     //connection is up, let's add a simple simple event
//     ws.on('message', (message: string) => { 
//         //[...]
//     }
// });
// setInterval(() => {
//     wss.clients.forEach((ws: ExtwebSocket) => {
//         if (!ws.isAlive) return ws.terminate();
//         ws.isAlive = false;
//         ws.ping(null, false, true);
//     });
// }, 10000);
// //start our server
// server.listen(process.env.PORT || 8999, () => {
//     console.log(`Server started on port ${server.address().port} :)`);
// });
//# sourceMappingURL=connection.js.map