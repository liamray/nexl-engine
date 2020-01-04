const nexlEngine = require('../nexl-engine/nexl-engine');
let source;
source = {filePath: 'nexl-sources/nexl-source1.js'};
source = {filePath: 'md-sources/md-src1.js'};

const result = nexlEngine.parseMD(source);


function escapeKey(key) {
	return key.replace(/-/g, '\\-');
}

function md2Expressions(md) {
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
				const keyEscaped = escapeKey(key);
				result.push(`\${${item.name}.${keyEscaped}}`);
			});
		}
	});
	return result;
}

const expressions = md2Expressions(result);
console.log(expressions);