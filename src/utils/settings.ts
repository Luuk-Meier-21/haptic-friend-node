import { FileController } from "./file";

export class SettingsController {
    file: FileController;

    constructor(fileName: string) {
        this.file = new FileController(fileName);
    }

    get = (): string[] => this.file.get().split(",");
    set = (content: string[]): boolean => this.file.set(content.join(","));
}