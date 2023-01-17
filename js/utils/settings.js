"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const file_1 = require("./file");
class SettingsController {
    file;
    constructor(fileName) {
        this.file = new file_1.FileController(fileName);
    }
    get = () => this.file.get().split(",");
    set = (content) => this.file.set(content.join(","));
}
exports.SettingsController = SettingsController;
//# sourceMappingURL=settings.js.map