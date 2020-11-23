const fsExtra = require('fs-extra');
const path = require('path');
const util = require('util');

(async () => {
    const data = JSON.parse(await fsExtra.readFile("./output.json"));
    await fsExtra.writeJson(path.join(__dirname, "out.json"), await data);
    util.
})()