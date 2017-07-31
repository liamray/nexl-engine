nexl.defaultExpression = '[${Z}]';

nexl.init = '${@1=Z}';

nexl.addInitFunc(function () {
	nexl.nexlize('${Z|@4|concat()=Z}');
	nexl.nexlize('${*Throw error please}');
}, 10);

nexl.addInitFunc(-10, function () {
	nexl.nexlize('${Z|@2|concat()=Z}');
});


nexl.addInitFunc(function () {
	nexl.nexlize('${Z|@3|concat()=Z}');
});
