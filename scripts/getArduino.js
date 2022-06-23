const { SerialPort } = require('serialport')

let path = '';
  
SerialPort.list().then(ports => {
    let done = false
    let count = 0
    let allports = ports.length
    ports.forEach((port) => {
        count = count + 1;
        pm  = port.manufacturer;

        if (typeof pm !== 'undefined' && pm.includes('arduino')) {
        path = port.path
        done = true
        console.log(path);
        process.exit(0);
        }
        if(count === allports && done === false){
        console.log("Cannot find Arduino");
        process.exit(1);
        // throw Error(`can't find any arduino`);
        }
    })
})