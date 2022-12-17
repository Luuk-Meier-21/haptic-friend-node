const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const { parseMessageString } = require("./serialparsing");
const serialDelay = 2000;

/**
 * Initializes serialport, waits 2 seconds for Arduino to initialize, then calls callback argument with serialports.
 * 
 */
const onReady = async (callback = (serialPort, parser) => { }) => {
    let handshakeMade = false;
    let hasResponded = false;

    const tryHandshake = (sp, tries = 0) => {
        sp.write("X0");
        // TODO: add retries for connecting, it will fail if the first message is not recieved.
    }

    const onData = (sp, parser, data) => {
        console.log(data)
        hasResponded = true;
        const message = parseMessageString(data);
        // Is response a valid handshake:
        if (message == "X0") {
            // Handshake is made:
            console.log("Handshake made, arduino is ready.")

            handshakeMade = true;
            parser.removeListener('data', onData);
            callback(sp, parser);
        }
    }

    try {
        const serialPort = await getSerial();
        const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n', }));
    
        parser.on("data", data => onData(serialPort, parser, data));
        tryHandshake(serialPort);
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

/**
 * Creates a Promise of a SerialPort object, that searches for a connected Arduino.
 * 
 * @returns `Promise<SerialPort>` Promise of a SerialPort object.
 */
const getSerial = async () => {
    let path = '';

    return new Promise((resolve, reject) => {
        // (from Stackoverflow) gets all active serialports, 
        // loops tru them looking for port.manufacturer name that contains Arduino
        // Then returns serialport object of Arduino
        SerialPort.list().then(ports => {
            let done = false;
            let count = 0;
            let allports = ports.length;
            ports.forEach((port) => {
                count = count + 1;
                pm = port.manufacturer;

                if (typeof pm !== 'undefined' && (pm.includes('arduino') || pm.includes('Arduino'))) {
                    path = port.path
                    done = true
                    const serialPort = new SerialPort({
                        path: path,
                        baudRate: 57600,
                        lock: false
                    });
                    resolve(serialPort);
                }
                if (count === allports && done === false) {
                    reject("No Arduino connected")
                    exit(0);
                    // throw Error(`can't find any arduino`);
                }
            })
        })
    })
}

module.exports = {
    onReady: onReady,
    getSerial: getSerial,
}
