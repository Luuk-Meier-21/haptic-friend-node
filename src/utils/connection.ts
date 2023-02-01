import { ReadlineParser, SerialPort } from "serialport";
import webSocket, { WebSocket } from "ws"
import Http from "http";
import express from "express";

import { readySerial } from "./serial";

type SerialEvent = "open" | "message" | "confirmation" | "rejection";
type WebSocketEvent = "open" | "message";

type ConnectionFunction = (message?: string) => void;

export class ConnectionController {
    private onSerialOpenArray: ConnectionFunction[] = [];
    private onSerialMessageArray: ConnectionFunction[] = [];
    private onSerialConfirmationArray: ConnectionFunction[] = [];
    private onSerialRejectionArray: ConnectionFunction[] = [];
    private onWebSocketOpenArray: ConnectionFunction[] = [];
    private onWebSocketMessageArray: ConnectionFunction[] = [];

    private serial: SerialPort;
    private serialQueue: string[] = [];
    private usingSerialQueue = false; 

    private webSocketServer: webSocket.Server<webSocket>;
    private webSocket: WebSocket;
    private server: Http.Server<typeof Http.IncomingMessage, typeof Http.ServerResponse>;
    private port = 3000;

    constructor() {
        const app = express(); 
        this.server = Http.createServer(app);
    }

    public start = () => {
        readySerial((serial: SerialPort, parser: ReadlineParser) => {
            this.serial = serial;
            const server = this.server;
            this.webSocketServer = new webSocket.Server({ server });

            parser.removeAllListeners();
            parser.on("data", this.onSerialData);
            this.callEventArray(this.onSerialOpenArray);

            this.webSocketServer.on("connection", (ws: webSocket) => {
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
    }  

    private callEventArray = (funcArray: ConnectionFunction[], param?: string) => {
        for (let i = 0; i < funcArray.length; i++) {
            if (param) funcArray[i](param);
            else funcArray[i]();
        }
    }

    private onSerialData = (message: string) => {
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
    }

    private onWebSocketData = (message: string) => {
        this.callEventArray(this.onWebSocketMessageArray, message.toString());
    }
    
    public sendSerial = (data: string) => {
        if (this.serial) {
            this.serial.write(data);
        } else {
            throw Error("Function (sendSerial) called before a serialport object was made available.");
        }
    }

    // Dont use in events called by users.
    public sendSerialArray = (array: string[]) => {
        if (this.usingSerialQueue) throw Error("Previous queue still in use.");
        this.usingSerialQueue = true;
        this.serialQueue = array;
        this.shiftSerialQueue();
    }

    private shiftSerialQueue = () => {
        const item = this.serialQueue.shift();
        if (!item) {
            this.usingSerialQueue = false;
            return;
        }

        console.log("sending:" + item);
        this.sendSerial(item);
    }

    public sendSocket = (data: string) => {
        if (this.webSocket) {
            this.webSocket.send(data);
        } else {
            throw Error("Function (sendWebSocket) called before a webSocket object was made available.");
        }
    }

    public setSerialListener = (type: SerialEvent, listener: ConnectionFunction) => {
        switch (type) {
            case "open":    this.onSerialOpenArray.push(listener); break;
            case "message": this.onSerialMessageArray.push(listener); break;
            case "confirmation": this.onSerialConfirmationArray.push(listener); break;
            case "rejection": this.onSerialRejectionArray.push(listener); break;
        }
    }

    public setWebSocketListener = (type: WebSocketEvent, listener: ConnectionFunction): void => {
        switch (type) {
            case "open":    this.onWebSocketOpenArray.push(listener); break;
            case "message": this.onWebSocketMessageArray.push(listener); break;
        }
    }

    private removeItem = <T extends ConnectionFunction>(array: T[], item: T) => {
        const index = array.indexOf(item);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }

    public removeSerialListener = (type: SerialEvent, listener: ConnectionFunction) => {
        switch (type) {
            case "open":         this.removeItem(this.onSerialOpenArray, listener); break;
            case "message":      this.removeItem(this.onSerialMessageArray, listener); break;
            case "confirmation": this.removeItem(this.onSerialConfirmationArray, listener); break
            case "rejection": this.removeItem(this.onSerialRejectionArray, listener); break
        }
    }

    public removeWebSocketListener = (type: WebSocketEvent, listener: ConnectionFunction) => {
        switch (type) {
            case "open":    this.removeItem(this.onWebSocketOpenArray, listener); break;
            case "message": this.removeItem(this.onWebSocketMessageArray, listener); break;
        }
    }
}


 

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