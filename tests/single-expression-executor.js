var ne = require('./../nexl-engine/nexl-engine');
var j79 = require('j79-utils');

var nexlSource;
nexlSource = {asFile: {fileName: 'nexl-sources/nexl-source1.js'}};

var externalArgs = {
	obj7: {
		home: 'c:\\temp'
	}
};

var result;
result = ne.nexlize(nexlSource, '${arr1[]${_index_}}', externalArgs);
console.log(result);
console.log('\ntype = ' + j79.getType(result));