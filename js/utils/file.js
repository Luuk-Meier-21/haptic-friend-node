"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const fs = require('fs');
function FileController(name, relativePath = "/") {
    this.path = require("os").homedir() + relativePath + name + ".json";
    let latestData = "";
    const construct = () => {
        if (!this.exists()) {
            this.write("");
        }
    };
    this.set = (content) => {
        if (!this.exists())
            return false;
        return this.write(content);
    };
    this.get = () => {
        this.read();
        return latestData;
    };
    this.exists = () => {
        try {
            return fs.existsSync(this.path);
        }
        catch (err) {
            console.error(err);
        }
        return false;
    };
    this.write = (content) => {
        try {
            fs.writeFileSync(this.path, content);
            return true;
        }
        catch (err) {
            console.error(err);
        }
        return false;
    };
    this.read = () => {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            latestData = data;
            return true;
        }
        catch (err) {
            console.error(err);
        }
        return false;
    };
    construct();
}
exports.FileController = FileController;
//# sourceMappingURL=file.js.map