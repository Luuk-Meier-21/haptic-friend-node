const { WebSocket } = require("ws");
const http = require("http");
const express = require("express");
const arduino = require("./utils/arduino");
const { ConnectionController } = require("./utils/connection");
const { KeyboardController } = require("./utils/keyboard");

// Server setup:
const app = express(); 
const port = 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${server.address().port}`);
});


const dummyNode = {
    node: 1,
    type: "a",
    character: "y"
}
const dummy = [dummyNode];

// Arduino Serial messages:
// message:     <Type><Value>
// setter:      S<Node><Type><Char>

const onArduinoConnection = (c,) => {

}

const onArduinoMessage = (data, c, sp, parser) => {
    console.log(data.toString())
}

const onWebsocketConnection = (c, sp, parser) => {

}

const onWebsocketMessage = (message, c, sp, parser) => {
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
}

arduino.onReady((sp, parser) => {
    const ws = new WebSocket.Server({ server });
    ws.removeAllListeners();
    ws.on("connection", ws => {
        const c = new ConnectionController(ws, sp);
        onArduinoConnection(c, sp, parser);

        ws.on("message", (message) => 
            onWebsocketMessage(message, c, sp, parser)
        );

        parser.removeAllListeners();
        parser.on("data", (data) => 
            onArduinoMessage(data, c, sp, parser)
        );
    });
});




