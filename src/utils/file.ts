import fs from "fs";

export class FileController {
    public path: string;
    private latestData = "";

    constructor(name: string, relativePath: string = "/") {
        this.path = require("os").homedir() + relativePath + name;

        if(!this.exists()) {
            this.write(this.latestData);
        }
    }

    set = (content: string): boolean => {
        if(!this.exists()) return false;
        return this.write(content);
    }

    get = (): string => {
        this.read();
        return this.latestData;
    }

    exists = (): boolean => {
        try {
            return fs.existsSync(this.path);
        } catch(err) {
            console.error(err)
        }
        return false;
    }

    write = (content: string): boolean => {
        try {
            fs.writeFileSync(this.path, content);
            return true;
        } catch (err) {
            console.error(err);
        }
        return false;
    }

    read = (): boolean => {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.latestData = data;
            return true;
        } catch (err) {
            console.error(err);
        }
        return false;
    }
}