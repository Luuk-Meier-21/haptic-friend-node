"use strict";
// PRoGrAMmINg; (PerformanceNavigationTiming.bind)
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./utils/settings");
const connection_1 = require("./utils/connection");
const settings = new settings_1.SettingsController("hpf-settings");
const connection = new connection_1.ConnectionController();
connection.setSerialListener("open", serialOpen);
connection.setSerialListener("message", serialMessage);
connection.start();
function serialOpen() {
}
function serialMessage(message) {
}
//# sourceMappingURL=index.js.map