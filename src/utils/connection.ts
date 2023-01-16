import { SerialPort } from "serialport";
import { WebSocket } from "ws"

const { statusCodes } = require("./status");

export class ConnectionController {
    constructor(
        public ws: WebSocket, 
        public sp: SerialPort
    ) {

        this.sendStatus();
    }

    isOpen = () => this.sp.isOpen;

    sendStatus = (err: any = undefined) => {
        if (err) console.log(err)
        this.ws.send(this.isOpen() ? statusCodes.open : statusCodes.closed);
    };

    ready = () => this.ws.send(statusCodes.ready);

    
    openSerial = () => this.sp.open(this.sendStatus);
    closeSerial = () => this.sp.close(this.sendStatus);
    sendSerial = (data: string) => this.sp.write(data);
    sendSocket = (data: string) => this.ws.send(data);
}