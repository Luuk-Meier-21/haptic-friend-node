"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseMessageString = data => data.toString().match(/^[a-zA-Z][0-9]/g);
module.exports = {
    parseMessageString: parseMessageString
};
//# sourceMappingURL=serialparsing.js.map