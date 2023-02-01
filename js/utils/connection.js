"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionController = void 0;
const tslib_1 = require("tslib");
const ws_1 = tslib_1.__importDefault(require("ws"));
const http_1 = tslib_1.__importDefault(require("http"));
const express_1 = tslib_1.__importDefault(require("express"));
const serial_1 = require("./serial");
class ConnectionController {
    onSerialOpenArray = [];
    onSerialMessageArray = [];
    onSerialConfirmationArray = [];
    onSerialRejectionArray = [];
    onWebSocketOpenArray = [];
    onWebSocketMessageArray = [];
    serial;
    serialQueue = [];
    usingSerialQueue = false;
    webSocketServer;
    webSocket;
    server;
    port = 3000;
    constructor() {
        const app = (0, express_1.default)();
        this.server = http_1.default.createServer(app);
    }
    start = () => {
        (0, serial_1.readySerial)((serial, parser) => {
            this.serial = serial;
            const server = this.server;
            this.webSocketServer = new ws_1.default.Server({ server });
            parser.removeAllListeners();
            parser.on("data", this.onSerialData);
            this.callEventArray(this.onSerialOpenArray);
            this.webSocketServer.on("connection", (ws) => {
                this.webSocket = ws;
                this.webSocket.removeAllListeners();
                this.webSocket.on("message", this.onWebSocketData);
                this.callEventArray(this.onWebSocketOpenArray);
            });
        });
        // Server websocket connection:
        this.server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    };
    callEventArray = (funcArray, param) => {
        for (let i = 0; i < funcArray.length; i++) {
            if (param)
                funcArray[i](param);
            else
                funcArray[i]();
        }
    };
    onSerialData = (message) => {
        const regex = /((c|r)(i|s|g|f)[a-z]*)/g;
        if (message.toString().match(regex)) {
            const identifier = message.charAt(0);
            switch (identifier) {
                case "c":
                    console.log("Confirm: " + message);
                    this.callEventArray(this.onSerialConfirmationArray, message.toString());
                    break;
                case "r":
                    console.log("Reject: " + message);
                    this.callEventArray(this.onSerialRejectionArray, message.toString());
                    break;
            }
            this.shiftSerialQueue();
            return;
        }
        // On other message:
        this.callEventArray(this.onSerialMessageArray, message.toString());
    };
    onWebSocketData = (message) => {
        this.callEventArray(this.onWebSocketMessageArray, message.toString());
    };
    sendSerial = (data) => {
        if (this.serial) {
            this.serial.write(data);
        }
        else {
            throw Error("Function (sendSerial) called before a serialport object was made available.");
        }
    };
    // Dont use in events called by users.
    sendSerialArray = (array) => {
        if (this.usingSerialQueue)
            throw Error("Previous queue still in use.");
        this.usingSerialQueue = true;
        this.serialQueue = array;
        this.shiftSerialQueue();
    };
    shiftSerialQueue = () => {
        const item = this.serialQueue.shift();
        if (!item) {
            this.usingSerialQueue = false;
            return;
        }
        console.log("sending:" + item);
        this.sendSerial(item);
    };
    sendSocket = (data) => {
        if (this.webSocket) {
            this.webSocket.send(data);
        }
        else {
            throw Error("Function (sendWebSocket) called before a webSocket object was made available.");
        }
    };
    setSerialListener = (type, listener) => {
        switch (type) {
            case "open":
                this.onSerialOpenArray.push(listener);
                break;
            case "message":
                this.onSerialMessageArray.push(listener);
                break;
            case "confirmation":
                this.onSerialConfirmationArray.push(listener);
                break;
            case "rejection":
                this.onSerialRejectionArray.push(listener);
                break;
        }
    };
    setWebSocketListener = (type, listener) => {
        switch (type) {
            case "open":
                this.onWebSocketOpenArray.push(listener);
                break;
            case "message":
                this.onWebSocketMessageArray.push(listener);
                break;
        }
    };
    removeItem = (array, item) => {
        const index = array.indexOf(item);
        if (index !== -1) {
            array.splice(index, 1);
        }
    };
    removeSerialListener = (type, listener) => {
        switch (type) {
            case "open":
                this.removeItem(this.onSerialOpenArray, listener);
                break;
            case "message":
                this.removeItem(this.onSerialMessageArray, listener);
                break;
            case "confirmation":
                this.removeItem(this.onSerialConfirmationArray, listener);
                break;
            case "rejection":
                this.removeItem(this.onSerialRejectionArray, listener);
                break;
        }
    };
    removeWebSocketListener = (type, listener) => {
        switch (type) {
            case "open":
                this.removeItem(this.onWebSocketOpenArray, listener);
                break;
            case "message":
                this.removeItem(this.onWebSocketMessageArray, listener);
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