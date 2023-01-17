import { ReadlineParser, SerialPort } from "serialport";
import webSocket, { WebSocket } from "ws"
import Http from "http";
import express from "express";

import { readySerial } from "./serail";

type SerialEvent = "open" | "message";
type WebSocketEvent = "open" | "message";

type ConnectionFunction = () => void;
type ParametisedConnectionFunction = (message: string) => void;

const nullFunc = () => {};

export class ConnectionController {

    private onSerialOpenArray: ConnectionFunction[] = [];

    private onSerialOpen: ConnectionFunction = nullFunc;
    private onSerialMessage: ParametisedConnectionFunction = nullFunc;

    private onWebSocketOpen: ConnectionFunction = nullFunc;
    private onWebSocketMessage: ParametisedConnectionFunction = nullFunc;

    private serial: SerialPort;
    private webSocketServer: webSocket.Server<webSocket>;
    private webSocket: WebSocket;
    private server: Http.Server<typeof Http.IncomingMessage, typeof Http.ServerResponse>;
    private port = 3000;

    constructor() {
        const app = express(); 

        this.server = Http.createServer(app);
    }



    start = () => {
        const callEach = <T extends ConnectionFunction & ParametisedConnectionFunction>(funcArray: T[], param?: string) => {
            for (let i = 0; i < funcArray.length; i++) {
                if (param) funcArray[i](param);
                else funcArray[i]();
            }
        }


        readySerial((serial: SerialPort, parser: ReadlineParser) => {
            this.serial = serial;
            callEach(this.onSerialOpenArray);

            this.onSerialOpen();

            const server = this.server;
            this.webSocketServer = new webSocket.Server({ server });

            this.webSocketServer.on("connection", (ws: webSocket) => {
                this.onWebSocketOpen()
                this.webSocket = ws;

                // Flush listeners:
                this.webSocket.removeAllListeners();
                parser.removeAllListeners();

                // WebSocket messages:
                this.webSocket.on("message", (message: string) => {
                    this.onWebSocketMessage(message)
                });
                    
                // Serial messages:
                parser.on("data", (data) => {
                    this.onSerialMessage(data)
                });
            });
        });
    }  

    listen = () => {
        this.server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
    
    sendSerial = (data: string) => {
        if (this.serial) {
            this.serial.write(data);
        } else {
            throw Error("Function (sendSerial) called before a serialport object was made available.");
        }
    }

    sendSocket = (data: string) => {
        if (this.webSocket) {
            this.webSocket.send(data);
        } else {
            throw Error("Function (webSocket) called before a webSocket object was made available.");
        }
    }

    setSerialListener = (type: SerialEvent, listener: ParametisedConnectionFunction | ConnectionFunction) => {
        switch (type) {
            case "open":    this.onSerialOpen = listener as ConnectionFunction; break;
            case "message": this.onSerialMessage = listener; break;
        }
    }

    setWebSocketListener = <T extends ConnectionFunction & ParametisedConnectionFunction>(type: WebSocketEvent, listener: T): void => {
        switch (type) {
            case "open":    this.onWebSocketOpen = listener; break;
            case "message": this.onWebSocketMessage = listener; break;
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