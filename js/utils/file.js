"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
class FileController {
    path;
    latestData = "";
    constructor(name, relativePath = "/") {
        this.path = require("os").homedir() + relativePath + name;
        if (!this.exists()) {
            this.write(this.latestData);
        }
    }
    set = (content) => {
        if (!this.exists())
            return false;
        return this.write(content);
    };
    get = () => {
        this.read();
        return this.latestData;
    };
    exists = () => {
        try {
            return fs_1.default.existsSync(this.path);
        }
        catch (err) {
            console.error(err);
        }
        return false;
    };
    write = (content) => {
        try {
            fs_1.default.writeFileSync(this.path, content);
            return true;
        }
        catch (err) {
            console.error(err);
        }
        return false;
    };
    read = () => {
        try {
            const data = fs_1.default.readFileSync(this.path, 'utf8');
            this.latestData = data;
            return true;
        }
        catch (err) {
            console.error(err);
        }
        return false;
    };
}
exports.FileController = FileController;
//# sourceMappingURL=file.js.map