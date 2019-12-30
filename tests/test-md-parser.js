const nexlEngine = require('../nexl-engine/nexl-engine');
let source;
source = {filePath: 'nexl-sources/nexl-source1.js'};
source = {filePath: 'md-sources/md-src1.js'};

const result = nexlEngine.parseMD(source);
console.log(result);