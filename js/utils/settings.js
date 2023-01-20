"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const file_1 = require("./file");
class SettingsController {
    file;
    constructor(fileName) {
        this.file = new file_1.FileController(fileName);
    }
    getRaw = () => this.file.get();
    get = () => {
        const dataArray = this.getRaw().split(",");
        if (dataArray.length == 1 && dataArray[0] === '')
            return [];
        return dataArray;
    };
    set = (content) => this.file.set(content.join(","));
    add = (setters, newSetter) => {
        const addNewSetter = (_array) => {
            let replacedNode = false;
            // If newSetter node is taken, replace with newSetter:
            const newArray = _array.map(setter => {
                const currentNode = setter.charAt(1);
                const messageNode = newSetter.charAt(1);
                const isTaken = currentNode === messageNode;
                if (isTaken)
                    replacedNode = true;
                return isTaken ? newSetter : setter;
            });
            // If newSetter node not taken, add to array:
            if (!replacedNode)
                newArray.push(newSetter);
            return newArray;
        };
        const newSetters = addNewSetter(setters);
        this.set(newSetters);
        return newSetters;
    };
}
exports.SettingsController = SettingsController;
//# sourceMappingURL=settings.js.map