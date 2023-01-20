import { FileController } from "./file";

export class SettingsController {
    file: FileController;

    constructor(fileName: string) {
        this.file = new FileController(fileName);
    }

    getRaw = (): string => this.file.get();
    get = (): string[] => {
        const dataArray = this.getRaw().split(",");
        if (dataArray.length == 1 && dataArray[0] === '') return [];
        return dataArray;
    }
    set = (content: string[]): boolean => this.file.set(content.join(","));
    add = (setters: string[], newSetter: string) => {
        const addNewSetter = (_array: string[]): string[] => {
            let replacedNode = false;
            // If newSetter node is taken, replace with newSetter:
            const newArray = _array.map(setter => {
                const currentNode = setter.charAt(1);
                const messageNode = newSetter.charAt(1);
                const isTaken = currentNode === messageNode;
                if (isTaken) replacedNode = true;
                return isTaken ? newSetter : setter;
            });
            // If newSetter node not taken, add to array:
            if (!replacedNode) newArray.push(newSetter);
            return newArray;
        }
        const newSetters = addNewSetter(setters);
        this.set(newSetters);
        return newSetters;  
    }
}