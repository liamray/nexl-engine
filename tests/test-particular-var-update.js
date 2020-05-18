const nexlEngine = require('../nexl-engine/nexl-engine');
const nexlSrcUtils = require('../nexl-engine/nexl-source-utils');
const tmpDir = require('os').tmpdir();
const path = require('path');
const fs = require('fs');

const emptyFile = path.join(tmpDir, 'tmp.js');
const customFile = path.join(tmpDir, 'custom-file.js');
const expressionFile = path.join(tmpDir, 'expressions.js');

// creating few sources in the tmp dir based on existing sources
fs.writeFileSync(customFile, 'a = 1; b = 1; a = 2; c = 3; a = 3; x = 1;', {encoding: "UTF-8"});
fs.writeFileSync(expressionFile, nexlSrcUtils.assembleSourceCode({filePath: 'nexl-sources/nexl-source1.js'}), {encoding: "UTF-8"});

function test(file, varName, newValue) {
	nexlSrcUtils.updateParticularVariable({
		filePath: file,
		varName: varName,
		varValue: newValue
	});

	const result = nexlEngine.nexlize({filePath: file}, '${' + varName + '}');

	if (JSON.stringify(result) !== JSON.stringify(newValue)) {
		throw `TEST FAILED !!! Expected for the [varValue=${newValue}], but got a [result=${result}]. [file=${file}], [varName=${varName}]`;
	}
}

/////////////////////////////////////////////////////////////////////////////////////////

// empty file
test(emptyFile, 'boolItem', false);
test(emptyFile, 'stam', {name: 'Ray', age: 999});
test(emptyFile, 'makeUrls', 1);
test(emptyFile, 'WS', ['hello', 'world']);

// expressions file
test(customFile, 'a', 99);
test(customFile, 'boolItem', false);
test(customFile, 'stam', {name: 'Ray', age: 999});
test(customFile, 'makeUrls', 1);
test(customFile, 'WS', ['hello', 'world']);

// custom file
test(expressionFile, 'boolItem', false);
test(expressionFile, 'stam', {name: 'Ray', age: 999});
test(expressionFile, 'makeUrls', 1);
test(expressionFile, 'WS', ['hello', 'world']);

/////////////////////////////////////////////////////////////////////////////////////////
console.log('ALL TESTS ARE PASSED !!!');
