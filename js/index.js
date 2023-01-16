"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ws_1 = require("ws");
const http_1 = require("http");
const express_1 = tslib_1.__importDefault(require("express"));
const arduino_1 = tslib_1.__importDefault(require("./utils/arduino"));
const settings_1 = require("./utils/settings");
const connection_1 = require("./utils/connection");
// const { KeyboardController } = require("./utils/keyboard");
const app = (0, express_1.default)();
const port = 3000;
const server = (0, http_1.createServer)(app);
const settings = new settings_1.SettingsController("hpf-settings");
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// Connection to arduino was made:
const onArduinoConnection = () => {
    settings.get();
};
// Message was send from arduino:
const onArduinoMessage = (data) => {
    console.log(data.toString());
};
// // Connection to websocket was made:
// const onWebsocketConnection = () => {
//     console.log("hi")
// }
// Message from websocket:
const onWebsocketMessage = (message, c) => {
    switch (message.toString()) {
        case "OPEN":
            c.openSerial();
            break;
        case "CLOSE":
            c.closeSerial();
            break;
        default:
            c.sendSerial(message);
    }
};
arduino_1.default.onReady((sp, parser) => {
    const ws = new ws_1.WebSocket.Server({ server });
    ws.removeAllListeners();
    onArduinoConnection();
    ws.on("connection", (ws) => {
        const c = new connection_1.ConnectionController(ws, sp);
        ws.on("message", (message) => onWebsocketMessage(message, c));
        parser.removeAllListeners();
        parser.on("data", (data) => onArduinoMessage(data));
    });
});
// PRoGrAMmINg; (PerformanceNavigationTiming.bind)
//# sourceMappingURL=index.js.map