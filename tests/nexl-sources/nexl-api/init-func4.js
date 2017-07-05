integer = 1979;
arr = [1, 2, 'hello'];

nexl.init = function () {
	throw 'Exception test...';
	nexl.set('arr', '${integer}');
};

nexl.defaultExpression = '${arr}';