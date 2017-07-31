nexl.defaultExpression = '[${Z}]';

nexl.init = '${@1=Z}';

nexl.addInitFunc(function () {
	nexl.nexlize('${Z|@4|concat()=Z}');
}, 10);

nexl.addInitFunc(-10, function () {
	nexl.nexlize('${Z|@2|concat()=Z}');
});


nexl.addInitFunc(function () {
	var z = nexl.get('Z');
	z += 3;
	nexl.set('Z', z);
});
