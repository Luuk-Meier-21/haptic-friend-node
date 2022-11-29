const { statusCodes } = require("./status");

function ConnectionController(ws, sp) {
    this.ws = ws;
    this.sp = sp;

    this.isOpen = () => sp.isOpen;

    this.sendStatus = (err = undefined) => {
        if (err) console.log(err)
        ws.send(this.isOpen() ? statusCodes.open : statusCodes.closed);
    };

    this.ready = () => ws.send(statusCodes.ready);

    this.sendStatus();
    this.openSerial = () => sp.open(this.sendStatus);
    this.closeSerial = () => sp.close(this.sendStatus);
}

module.exports = {
    ConnectionController: ConnectionController
}