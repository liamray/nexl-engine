const nexlEngine = require('../nexl-engine/nexl-engine');
const source = {filePath: 'nexl-sources/nexl-source1.js'};

const result = nexlEngine.parseMD(source);
console.log(result);