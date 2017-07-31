x = 10;

'@ src2.js';
'@ src3.js';

nexl.defaultExpression = '${y}';

nexl.addInitFunc(function () {
	nexl.set('A', 'CCC');
});

nexl.addInitFunc(function () {
	nexl.set('A', 'BBB');
});


nexl.addInitFunc(function () {
	nexl.set('A', 'AAA');
});
