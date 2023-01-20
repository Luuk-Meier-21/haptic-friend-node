// PRoGrAMmINg; (PerformanceNavigationTiming.bind)

import { SettingsController } from "./utils/settings";
import { ConnectionController } from "./utils/connection";
import { regexPrefixPatern } from "./utils/regex";

const settings = new SettingsController("hpf-settings");
const connection = new ConnectionController();

connection.setWebSocketListener("message", webSocketMessage);
connection.setSerialListener("open", serialOpen);
connection.setSerialListener("message", serialMessage);
connection.start();

export const prefixs = ["i", "s", "g", "f"];

// WebSocket:
function webSocketMessage(message: string) {
    const prefixPatern = regexPrefixPatern(prefixs);
    if(message.match(prefixPatern)) {
        const identifier = message.charAt(0);
        switch (identifier) {
            case "i": instruction(message); break;
            case "s": setter(message); break;
            case "g": getter(message); break;
        }
    } else {
        // Not a prefixed instruction:
    }
}

function instruction(message: string) {
    connection.sendSerial(message);
}

function setter(message: string) {
    const hasDuplicate = (): boolean => setters.indexOf(message) === -1;
    
    const setters = settings.get();
    if (hasDuplicate()) {
        const newSetters = settings.add(setters, message);
        console.log(newSetters);
        try {
            connection.sendSerialArray(newSetters); 
        } catch(e) {
            console.log("Oh NO");
        }
    }
}

// on first setter after init

function getter(message: string) {
    connection.sendSerial(message);
}

// Serial:
function serialMessage(message: string) {
    console.log("serial:" + message);
}

function serialOpen(message: string) {
    const setters = settings.get();
    connection.sendSerialArray(setters);
}




