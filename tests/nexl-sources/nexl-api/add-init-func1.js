nexl.defaultExpression = '${Z}';

nexl.addInitFunc(function () {
	nexl.nexlize('${@1=A}');
});

nexl.addInitFunc(function () {
	nexl.nexlize('${A=B}');
});


nexl.addInitFunc(function () {
	nexl.nexlize('${B=Z}');
});
