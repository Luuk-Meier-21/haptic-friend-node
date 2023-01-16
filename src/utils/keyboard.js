const { exec } = require('node:child_process')
const fs = require('fs');

function KeyboardController() {

    /**
     * @todo: have a way to update the request when data has changes, for exaple when the clientapp updates the map.
     * @returns {Object} json object with all keystroke mappings.
     */
    const getKeystrokeMap = () => {
        const data = fs.readFileSync('/Users/luukmeier/Documents/haptic-friend/keystroke-map.json', {encoding:'utf8', flag:'r'});
        const json = JSON.parse(data);
        return json.keystrokes;
    }

    /**
     * @returns A OS specific function for simulating keystrokes.
     */
    const getCommandByOS = () => {
        switch (process.platform) {
            case "darwin":
                // MacOS
                return (string) => `osascript -e 'tell application "System Events" to keystroke "${string}" using {}'`
            default:
                // 
                return (string) => `osascript -e 'tell application "System Events" to keystroke "${string}" using {}'`
                break;
        }
    }

    this.mapping = getKeystrokeMap()

    /**
     * Simulates keystrokes given by string param.
     * @param {String} string
     */
    this.write = (string) => {
        const currentOSCommand = getCommandByOS();
        
        exec(currentOSCommand(string), (err, output) => {
            if (err) {
                console.error("could not execute command: ", err)
                return
            }
        })
    }
}

module.exports = {
    KeyboardController: KeyboardController
}


// const keystroke = (key) => `osascript -e 'tell application "System Events" to keystroke "${key}" using { shift down }'`

// class Keyboard {
//     constructor() {
        
//     }
// }