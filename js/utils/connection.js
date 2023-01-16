"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionController = void 0;
const { statusCodes } = require("./status");
class ConnectionController {
    ws;
    sp;
    constructor(ws, sp) {
        this.ws = ws;
        this.sp = sp;
        this.sendStatus();
    }
    isOpen = () => this.sp.isOpen;
    sendStatus = (err = undefined) => {
        if (err)
            console.log(err);
        this.ws.send(this.isOpen() ? statusCodes.open : statusCodes.closed);
    };
    ready = () => this.ws.send(statusCodes.ready);
    openSerial = () => this.sp.open(this.sendStatus);
    closeSerial = () => this.sp.close(this.sendStatus);
    sendSerial = (data) => this.sp.write(data);
    sendSocket = (data) => this.ws.send(data);
}
exports.ConnectionController = ConnectionController;
//# sourceMappingURL=connection.js.map