const { FileController } = require("./file");

function SettingsController(fileName) {
    this.file = new FileController(fileName);

    this.get = () => this.file.get().split(",");
    this.set = content => this.file.set(content.join(","));
}

module.exports = {
    SettingsController: SettingsController
}