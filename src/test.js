// const fs = require('fs');

// export class FileController {
//     public path: String;
//     private latestData = "";

//     constructor(
//         public name, 
//         public relativePath = "/"
//     ) {
//         this.path = require("os").homedir() + relativePath + name + ".json";

//         if(!this.exists()) {
//             this.write("");
//         }
//     }

//     set = (content) => {
//         if(!this.exists()) return false;
//         return this.write(content);
//     }

//     get = () => {
//         this.read();
//         return this.latestData;
//     }

//     exists = () => {
//         try {
//             return fs.existsSync(this.path);
//         } catch(err) {
//             console.error(err)
//         }
//         return false;
//     }

//     write = (content) => {
//         try {
//             fs.writeFileSync(this.path, content);
//             return true;
//         } catch (err) {
//             console.error(err);
//         }
//         return false;
//     }

//     read = () => {
//         try {
//             const data = fs.readFileSync(this.path, 'utf8');
//             this.latestData = data;
//             return true;
//         } catch (err) {
//             console.error(err);
//         }
//         return false;
//     }
// }