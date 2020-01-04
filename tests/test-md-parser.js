const nexlEngine = require('../nexl-engine/nexl-engine');

let source;
source = {filePath: 'md-sources/md-src1.js'};
source = {filePath: 'nexl-sources/nexl-source1.js'};

const result = nexlEngine.parseMD(source);

function md2Expressions(md) {
	const opRegex = new RegExp(`([${nexlEngine.OPERATIONS_ESCAPED}])`, 'g');
	const result = [];
	md.forEach(item => {
		if (item.type === 'Function') {
			const args = item.args.length < 1 ? '' : `${item.args.join('|')}|`;
			result.push(`\${${args}${item.name}()}`);
			return;
		}

		result.push(`\${${item.name}}`);

		if (item.type === 'Object' && item.keys) {
			item.keys.forEach(key => {
				const keyEscaped = key.replace(opRegex, '\\$1');
				result.push(`\${${item.name}.${keyEscaped}}`);
			});
		}
	});
	return result;
}

md2Expressions(result).forEach(item => console.log(item));
