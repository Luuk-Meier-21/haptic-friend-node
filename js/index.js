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
connection.setSerialListener("confirmation", confirmation);
connection.setSerialListener("rejection", rejection);
connection.setSerialListener("message", serialMessage);
connection.start();
exports.prefixs = ["i", "s", "g", "f"];
// WebSocket:
function webSocketMessage(message) {
    const delegateMessage = (message) => {
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
    };
    const prefixPatern = (0, regex_1.regexPrefixPatern)(exports.prefixs);
    if (message.match(prefixPatern)) {
        delegateMessage(message);
    }
    else {
        // Not a prefixed instruction:
    }
}
function instruction(message) {
    connection.sendSerial(message);
}
function setter(message) {
    let setters = settings.get();
    if (setters.indexOf(message) === -1) {
        setters = settings.add(setters, message);
    }
    // Always send setters on setter message, else there is a change of node and embedded holding different values;
    try {
        connection.sendSerialArray(setters);
    }
    catch (e) {
        console.error("Could not send serial array.");
        console.error(e);
    }
}
function confirmation(message) {
    const identifier = message.charAt(1);
    if (identifier == 's') {
        const confirmedMessage = message.substring(1, message.length);
    }
}
function rejection(message) {
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
    // Initial message of available setters:
    connection.sendSerialArray(setters);
}
//# sourceMappingURL=index.js.map