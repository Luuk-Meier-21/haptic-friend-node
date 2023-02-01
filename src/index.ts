// PRoGrAMmINg; (PerformanceNavigationTiming.bind)

import { SettingsController } from "./utils/settings";
import { ConnectionController } from "./utils/connection";
import { regexPrefixPatern } from "./utils/regex";

const settings = new SettingsController("hpf-settings");
const connection = new ConnectionController();

connection.setWebSocketListener("message", webSocketMessage);
connection.setSerialListener("open", serialOpen);
connection.setSerialListener("confirmation", confirmation);
connection.setSerialListener("rejection", rejection);
connection.setSerialListener("message", serialMessage);
connection.start();

export const prefixs = ["i", "s", "g", "f"];

// WebSocket:
function webSocketMessage(message: string) {
    const delegateMessage = (message: string) => {
        const identifier = message.charAt(0);
        switch (identifier) {
            case "i": instruction(message); break;
            case "s": setter(message); break;
            case "g": getter(message); break;
        }
    }

    const prefixPatern = regexPrefixPatern(prefixs);
    if(message.match(prefixPatern)) {
        delegateMessage(message);
    } else {
        // Not a prefixed instruction:
    }
}

function instruction(message: string) {
    connection.sendSerial(message);
}

function setter(message: string) {
    let setters = settings.get();
    
    if (setters.indexOf(message) === -1) {
        setters = settings.add(setters, message);
    }

    // Always send setters on setter message, else there is a change of node and embedded holding different values;
    try {
        connection.sendSerialArray(setters); 
    } catch(e) {
        console.error("Could not send serial array.");
        console.error(e);
    }
}

function confirmation(message: string) {
    const identifier = message.charAt(1);
    if (identifier == 's') {
        const confirmedMessage = message.substring(1, message.length);
    }
}

function rejection(message: string) {

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
    // Initial message of available setters:
    connection.sendSerialArray(setters);
}




