const nexlEngine = require('../nexl-engine/nexl-engine');

const desiredResult = [
	{
		"name": "a1"
	},
	{
		"name": "b1"
	},
	{
		"name": "c1"
	},
	{
		"name": "d1",
		"type": "Number"
	},
	{
		"name": "e1",
		"type": "String"
	},
	{
		"name": "f1",
		"type": "Boolean"
	},
	{
		"name": "g1",
		"keys": [
			"a",
			"zzz",
			"yyy"
		],
		"type": "Object"
	},
	{
		"name": "h1",
		"type": "Array"
	},
	{
		"name": "i1",
		"type": "Function",
		"args": []
	},
	{
		"name": "j1",
		"type": "Function",
		"args": [
			"aaa",
			"bbb",
			"ccc"
		]
	},
	{
		"name": "k1",
		"type": "Function",
		"args": []
	},
	{
		"name": "l1",
		"type": "Function",
		"args": [
			"ggg",
			"hhh",
			"jjj"
		]
	},
	{
		"name": "m1"
	},
	{
		"name": "n1"
	},
	{
		"name": "a2"
	},
	{
		"name": "b2"
	},
	{
		"name": "c2"
	},
	{
		"name": "d2",
		"type": "Number"
	},
	{
		"name": "e2",
		"type": "String"
	},
	{
		"name": "f2",
		"type": "Boolean"
	},
	{
		"name": "g2",
		"keys": [
			"a",
			"zzz",
			"yyy"
		],
		"type": "Object"
	},
	{
		"name": "h2",
		"type": "Array"
	},
	{
		"name": "i2",
		"type": "Function",
		"args": []
	},
	{
		"name": "j2",
		"type": "Function",
		"args": [
			"aaa",
			"bbb",
			"ccc"
		]
	},
	{
		"name": "k2",
		"type": "Function",
		"args": []
	},
	{
		"name": "l2",
		"type": "Function",
		"args": [
			"ggg",
			"hhh",
			"jjj"
		]
	},
	{
		"name": "m2"
	},
	{
		"name": "n2"
	},
	{
		"name": "a3"
	},
	{
		"name": "b3"
	},
	{
		"name": "c3"
	},
	{
		"name": "d3",
		"type": "Number"
	},
	{
		"name": "e3",
		"type": "String"
	},
	{
		"name": "f3",
		"type": "Boolean"
	},
	{
		"name": "g3",
		"keys": [
			"a",
			"zzz",
			"yyy"
		],
		"type": "Object"
	},
	{
		"name": "h3",
		"type": "Array"
	},
	{
		"name": "i3",
		"type": "Function",
		"args": []
	},
	{
		"name": "j3",
		"type": "Function",
		"args": [
			"aaa",
			"bbb",
			"ccc"
		]
	},
	{
		"name": "k3",
		"type": "Function",
		"args": []
	},
	{
		"name": "l3",
		"type": "Function",
		"args": [
			"ggg",
			"hhh",
			"jjj"
		]
	},
	{
		"name": "m3"
	},
	{
		"name": "n3"
	},
	{
		"name": "a4"
	},
	{
		"name": "b4"
	},
	{
		"name": "c4"
	},
	{
		"name": "d4",
		"type": "Number"
	},
	{
		"name": "e4",
		"type": "String"
	},
	{
		"name": "f4",
		"type": "Boolean"
	},
	{
		"name": "g4",
		"keys": [
			"a",
			"zzz",
			"yyy"
		],
		"type": "Object"
	},
	{
		"name": "h4",
		"type": "Array"
	},
	{
		"name": "i4",
		"type": "Function",
		"args": []
	},
	{
		"name": "j4",
		"type": "Function",
		"args": [
			"aaa",
			"bbb",
			"ccc"
		]
	},
	{
		"name": "k4",
		"type": "Function",
		"args": []
	},
	{
		"name": "l4",
		"type": "Function",
		"args": [
			"ggg",
			"hhh",
			"jjj"
		]
	},
	{
		"name": "m4"
	},
	{
		"name": "n4"
	},
	{
		"name": "aaa.bbb.ccc.ddd",
		"type": "Number"
	},
	{
		"name": "test2",
		"type": "Function",
		"args": [
			"xxx",
			"yyy",
			"zzz"
		]
	},
	{
		"name": "test3",
		"type": "Function",
		"args": []
	},
	{
		"name": "PEARL_BATCH",
		"keys": [
			"PRE-UT",
			"APPDEV",
			"USERTEST",
			"YEST",
			"TRAIN",
			"PROD"
		],
		"type": "Object"
	}
];


const source = {filePath: 'md-sources/md-src1.js'};

const result = nexlEngine.parseMD(source);

require('assert')(JSON.stringify(result) === JSON.stringify(desiredResult));
