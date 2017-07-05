integer = 1979;
arr = [1, 2, 'hello'];

function test() {
	var integer = nexl.get('integer');
	integer++;
	nexl.set('arr', integer);
}

nexl.defaultExpression = '${test();arr}';