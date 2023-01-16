const fs = require('fs');

export function FileController(name: string, relativePath: string = "/") {
    this.path = require("os").homedir() + relativePath + name + ".json";

    let latestData = "";

    const construct = (): void => {
        if(!this.exists()) {
            this.write("");
        }
    }

    this.set = (content: string): boolean => {
        if(!this.exists()) return false;
        return this.write(content);
    }

    this.get = (): string => {
        this.read();
        return latestData;
    }

    this.exists = (): boolean => {
        try {
            return fs.existsSync(this.path);
        } catch(err) {
            console.error(err)
        }
        return false;
    }

    this.write = (content: string): boolean => {
        try {
            fs.writeFileSync(this.path, content);
            return true;
        } catch (err) {
            console.error(err);
        }
        return false;
    }

    this.read = (): boolean => {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            latestData = data;
            return true;
        } catch (err) {
            console.error(err);
        }
        return false;
    }

    construct();
}