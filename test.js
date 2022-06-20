const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const port = new SerialPort({
    path: '/dev/cu.usbmodem11101',
    baudRate: 115200,
    lock: false
});

const parser = port.pipe(new ReadlineParser({
    delimiter: '\r\n'
  }));

// port.on("data", data => {
//     console.log(`${data}`)
// })

port.on("data", data => {
    console.log(`${data}`)
})



setTimeout(() => {
    port.write("TEST");
}, 3000)
