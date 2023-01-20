"use strict";
// PRoGrAMmINg; (PerformanceNavigationTiming.bind)
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefixs = void 0;
const settings_1 = require("./utils/settings");
const connection_1 = require("./utils/connection");
const regex_1 = require("./utils/regex");
const settings = new settings_1.SettingsController("hpf-settings");
const connection = new connection_1.ConnectionController();
connection.setWebSocketListener("message", webSocketMessage);
connection.setSerialListener("open", serialOpen);
connection.setSerialListener("message", serialMessage);
connection.start();
exports.prefixs = ["i", "s", "g", "f"];
// WebSocket:
function webSocketMessage(message) {
    const prefixPatern = (0, regex_1.regexPrefixPatern)(exports.prefixs);
    if (message.match(prefixPatern)) {
        const identifier = message.charAt(0);
        switch (identifier) {
            case "i":
                instruction(message);
                break;
            case "s":
                setter(message);
                break;
            case "g":
                getter(message);
                break;
        }
    }
    else {
        // Not a prefixed instruction:
    }
}
function instruction(message) {
    connection.sendSerial(message);
}
function setter(message) {
    const hasDuplicate = () => setters.indexOf(message) === -1;
    const setters = settings.get();
    if (hasDuplicate()) {
        const newSetters = settings.add(setters, message);
        console.log(newSetters);
        try {
            connection.sendSerialArray(newSetters);
        }
        catch (e) {
            console.log("Oh NO");
        }
    }
}
// on first setter after init
function getter(message) {
    connection.sendSerial(message);
}
// Serial:
function serialMessage(message) {
    console.log("serial:" + message);
}
function serialOpen(message) {
    const setters = settings.get();
    connection.sendSerialArray(setters);
}
//# sourceMappingURL=index.js.map