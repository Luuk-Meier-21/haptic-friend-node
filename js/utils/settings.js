"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { FileController } = require("./file");
function SettingsController(fileName) {
    this.file = new FileController(fileName);
    this.get = () => this.file.get().split(",");
    this.set = content => this.file.set(content.join(","));
}
module.exports = {
    SettingsController: SettingsController
};
//# sourceMappingURL=settings.js.map