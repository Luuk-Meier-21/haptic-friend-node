// PRoGrAMmINg; (PerformanceNavigationTiming.bind)

import { SettingsController } from "./utils/settings";
import { ConnectionController } from "./utils/connection";

const settings = new SettingsController("hpf-settings");
const connection = new ConnectionController();
connection.setSerialListener("open", serialOpen);
connection.setSerialListener("message", serialMessage);
connection.start();

function serialOpen() {

}

function serialMessage(message: string) {

}




