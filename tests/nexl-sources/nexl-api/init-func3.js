integer = 1979;
arr = [1, 2, 'hello'];

nexl.init = function () {
	nexl.set('arr', '${integer}');
};

nexl.defaultExpression = '${arr}';