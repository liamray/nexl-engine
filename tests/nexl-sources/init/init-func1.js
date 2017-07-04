integer = 1979;
arr = [1, 2, 'hello'];

nexl.init = function () {
	return nexl.nexlize('${arr}');
};

nexl.defaultExpression = '${arr}';