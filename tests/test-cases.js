module.exports = [];


// key is nexl expression
module.exports.push({
	expression: '${obj1.71}',
	result: 'berry'
});


// function call
module.exports.push({
	expression: 'hello ${escapeDrpProd(${@DRP\\-PROD})}',
	result: 'hello DRP\\-PROD'
});


// empty input
module.exports.push({
	expression: '',
	result: ''
});

// no expression test
module.exports.push({
	expression: 'no expression',
	result: 'no expression'
});

// undefined
module.exports.push({
	expression: '${}',
	result: undefined
});

// undefined
module.exports.push({
	expression: '${~O}',
	result: {} // it must be a { 'obj': undefined }. but JSON.stringify() make an empty object of this ( there are few more module.exports like this here )
});

// empty array
module.exports.push({
	expression: '${#A}',
	result: []
});

// undefined
module.exports.push({
	expression: '${${}.a.b.c}',
	result: undefined
});

// undefined
module.exports.push({
	expression: '${${} .a.b.c}',
	throwsException: true
});

// undefined variable
module.exports.push({
	expression: '${undefinedVariable} ${undefinedVariable}',
	throwsException: true
});

// simple variable resolution
module.exports.push({
	expression: '1[${undefinedVariable@}] 2[${undefinedVariable2@}] 3[${undefinedVariable@111}] 4[${aaa\\:${bbb@}@222}]',
	result: '1[] 2[] 3[111] 4[222]'
});

// subst bug fix : ${intItem} hello ${x:${intItem}}
module.exports.push({
	expression: '${intItem} hello ${x@${intItem}}',
	result: '71 hello 71'
});

// default value test
module.exports.push({
	expression: '${xxx@1:num}',
	result: 1
});

// external arg test
module.exports.push({
	expression: '${intItem}',
	result: 1,
	args: {
		intItem: 1
	}
});

// cartesian product
module.exports.push({
	expression: '${intItem} ${strItem} ${boolItem} ${arr1}',
	result: ['71 berry true queen', '71 berry true muscle', '71 berry true 79', '71 berry true false']
});

// array concatenation with object
module.exports.push({
	expression: '${arr1&${obj1}}',
	throwsException: true
});

// array concatenation with array
module.exports.push({
	expression: '${arr1&${arr1}}',
	throwsException: true
});

// array concatenation with undefined variable
module.exports.push({
	expression: '${arr1&${undefinedVar}}',
	throwsException: true
});

// array concatenation with null
module.exports.push({
	expression: '${arr1&${@:null}}',
	throwsException: true
});

// array concatenation, escaping special chars
module.exports.push({
	expression: '${arr1&,} ${arr1&,${intItem}} ${arr1&\\&} ${arr1&\\@\\~\\<\\#\\-\\&\\^\\!\\*\\?\\%\\>\\+\\:}',
	result: 'queen,muscle,79,false queen,71muscle,7179,71false queen&muscle&79&false queen@~<#-&^!*?%>+:muscle@~<#-&^!*?%>+:79@~<#-&^!*?%>+:false'
});

// arrays
module.exports.push({
	expression: '${arr3}',
	result: ['queen', 'muscle', 79, false, 'air', 16, 99, true, 'smooth']
});

// arr single element
module.exports.push({
	expression: '${arr5}',
	result: ['hello']
});

// arrays
module.exports.push({
	expression: '${arr1} ${arr2}',
	result: ['queen air', 'muscle air', '79 air', 'false air', 'queen 16', 'muscle 16', '79 16', 'false 16', 'queen 99', 'muscle 99', '79 99', 'false 99', 'queen true', 'muscle true', '79 true', 'false true', 'queen smooth', 'muscle smooth', '79 smooth', 'false smooth']
});

// arrays
module.exports.push({
	expression: '${arr8}',
	result: [71, 10, 'a', true]
});

// arrays
module.exports.push({
	expression: '${arr9}',
	result: [{
		'71': 'berry',
		beneficial: 'mint',
		test: 'righteous',
		'()': 'trick',
		disturbed: 46,
		price: true,
		pack: {strong: 'balance', deer: 7}
	},
		10,
		'a',
		true]
});


// objects
module.exports.push({
	expression: '${obj1}',
	result: {
		beneficial: 'mint',
		'test': 'righteous',
		'()': 'trick',
		disturbed: 46,
		price: true,
		pack: {
			strong: 'balance',
			deer: 7
		},
		71: 'berry'
	}
});

// objects
module.exports.push({
	expression: '${obj1.${prop}@1}',
	result: {
		'71': 'berry',
		beneficial: 'mint',
		test: 'righteous',
		'()': 'trick',
		disturbed: 46,
		price: true,
		pack: {strong: 'balance', deer: 7}
	}
});

// objects
module.exports.push({
	expression: '${obj1.${prop@}@2}',
	result: '2'
});

// objects
module.exports.push({
	expression: '${obj1.${prop@:null}@3}',
	result: '3'
});

// nested objects
module.exports.push({
	expression: '${obj1a.x.deer}',
	result: 7
});

// array of objects
module.exports.push({
	expression: '${objArray1}',
	result: [{
		beneficial: 'mint',
		'test': 'righteous',
		'()': 'trick',
		disturbed: 46,
		price: true,
		pack: {
			strong: 'balance',
			deer: 7
		},
		71: 'berry'
	}, {
		x: {
			strong: 'balance',
			deer: 7
		}
	}]
});

// ~O action
module.exports.push({
	expression: '${intItem~O}',
	result: {intItem: 71}
});

// ~O action
module.exports.push({
	expression: '${~O+${intItem~O}}',
	result: {intItem: 71}
});

// ~O action
module.exports.push({
	expression: '${obj1.pack~O}',
	result: {strong: 'balance', deer: 7}
});

// ~O action
module.exports.push({
	expression: '${obj1.pack.deer~O}',
	result: {'obj1.pack.deer': 7}
});

// ~O action
module.exports.push({
	expression: '${HOSTS.APP_SERVER_INTERFACES.${keys}~O}',
	result: {'HOSTS.APP_SERVER_INTERFACES.[]': 'yest'}
});

// #A action
module.exports.push({
	expression: '${HOSTS.APP_SERVER_INTERFACES.PROD.SECOND[0]#A}',
	result: ['cuddly2']
});

// #A action
module.exports.push({
	expression: '${HOSTS.APP_SERVER_INTERFACES.PROD.SECOND[0]#A~O}',
	result: {'HOSTS.APP_SERVER_INTERFACES.PROD.SECOND': ['cuddly2']}
});

// #A action
module.exports.push({
	expression: '${HOSTS.APP_SERVER_INTERFACES.PROD.SECOND[0]~O#A}',
	result: [{'HOSTS.APP_SERVER_INTERFACES.PROD.SECOND': 'cuddly2'}]
});

// keys and values
module.exports.push({
	expression: 'KEYS=[${obj1~K&,}] VALUES=[${obj1~V&,}]',
	result: 'KEYS=[71,beneficial,test,(),disturbed,price,pack] VALUES=[berry,mint,righteous,trick,46,true,balance,7]'
});

// reverse resolution
module.exports.push({
	expression: '${obj1<${boolItem}} ${obj1<${strItem}} ${obj1<${undefinedVariable@}!E@undefined}',
	result: ['price 71 undefined']
});

// reverse resolution - type check
module.exports.push({
	expression: '${obj1<${@true:bool}[0]}',
	result: 'price'
});

// reverse resolution - type check
module.exports.push({
	expression: '${obj1<${@46:num}[0]}',
	result: 'disturbed'
});

// reverse resolution - array as input and output
module.exports.push({
	expression: '${obj1<${obj1Keys}}',
	result: ['71', 'beneficial', 'pack']
});

// reverse resolution - empty value
module.exports.push({
	expression: '${obj1<asd!E}',
	result: undefined
});

// reverse resolution - empty value
module.exports.push({
	expression: '${obj1<asd}',
	result: []
});

// reverse resolution - empty values
module.exports.push({
	expression: '${obj1<${arr1}}',
	result: []
});

// reverse resolution - empty values
module.exports.push({
	expression: '${obj1<${arr1}!E}',
	result: undefined
});

// reverse resolution - should resolve the highest key
module.exports.push({
	expression: '${HOSTS.APP_SERVER_INTERFACES<cuddly2}',
	result: ['PROD']
});

// reverse resolution - debug_opts
module.exports.push({
	expression: '${DEBUG_OPTS[0]}',
	result: '-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8790',
	args: {
		IS_DEBUG_ON: 'on'
	}
});

// evaluate as undefined action -> string
module.exports.push({
	expression: '${evaluateAsUndefined2!U}',
	result: undefined
});

// evaluate as undefined action -> array
module.exports.push({
	expression: '${evaluateAsUndefined1!U&,} ${evaluateAsUndefined1&,}',
	result: 'disconnect,24,,false disconnect,24,,,false'
});

// evaluate as undefined action -> object
module.exports.push({
	expression: '${obj3!U}',
	result: {
		item1: 'test',
		item3: 34
	}
});

// funcs
module.exports.push({
	expression: '${reverseArray(${arr1})}',
	result: [false, 79, 'muscle', 'queen']
});

// funcs
module.exports.push({
	expression: '${reverseArray(${arr1})[0]}',
	result: false
});

// funcs
module.exports.push({
	expression: '${reverseArray(${arr1}).x.y.z}',
	result: [false, 79, 'muscle', 'queen']
});

// funcs
module.exports.push({
	expression: '${reverseArray(${arr1})&,}',
	result: 'false,79,muscle,queen'
});

// funcs
module.exports.push({
	expression: '${returnsArrayOfObjects()}',
	result: [{hello: 1}, {hello: 2}, {hello: 3}, {hello: 4}]
});

// funcs
module.exports.push({
	expression: '${returnsArrayOfObjects()[3].hello}',
	result: 4
});

// funcs
module.exports.push({
	expression: '${returnsArrayOfObjects()&,}',
	result: '[object Object],[object Object],[object Object],[object Object]'
});

// funcs
module.exports.push({
	expression: '${obj2.pack.wrapWithBrackets(${@1:num})}',
	result: '{1}'
});

// funcs
module.exports.push({
	expression: '${nexlEngineInternalCall()}',
	result: 'queen,muscle,79,false'
});

// array indexes
module.exports.push({
	expression: '${arr1[2..1, 3..2]}',
	result: undefined
});

// array indexes
module.exports.push({
	expression: '${arr7[1, 2, 999, 3]}',
	result: [undefined, null, undefined]
});

// array indexes
module.exports.push({
	expression: '${arr1[]}',
	result: ['queen', 'muscle', 79, false]
});

// array indexes
module.exports.push({
	expression: '${arr1[${intItem}]}',
	result: undefined
});

// array indexes
module.exports.push({
	expression: '${arr1[1..0]}',
	result: undefined
});

// array indexes
module.exports.push({
	expression: '${arr1[0..1][0..1][0..1]}',
	result: ['queen', 'muscle']
});

// array indexes
module.exports.push({
	expression: '${arr1[999..-1]}',
	throwsException: undefined
});

// array indexes
module.exports.push({
	expression: '${arr1[0..999]}',
	result: ['queen', 'muscle', 79, false]
});

// unitedKey
module.exports.push({
	expression: '${unitedKey}',
	result: 'price',
	args: {
		KEY: 'disturbed'
	}
});

module.exports.push({
	expression: '${unitedKey}',
	result: '()',
	args: {
		KEY: '()'
	}
});

// object key reverse resolution
module.exports.push({
	expression: '${obj1<undefinedVariable}',
	result: []
});

// object key reverse resolution
module.exports.push({
	expression: '${obj1<undefinedVariable!E}',
	result: undefined
});

////////////////////////////////////// ALL_APP_SERVER_INTERFACES //////////////////////////////////////
// ENV = DEV
module.exports.push({
	expression: '${ALL_APP_SERVER_INTERFACES}',
	result: ['zombie', 'arrows', 'zebra'],
	args: {
		ENV: 'DEV'
	}
});

// ENV = DEV, INSTANCE = FIRST
module.exports.push({
	expression: '${ALL_APP_SERVER_INTERFACES}',
	result: ['zombie', 'arrows', 'zebra'],
	args: {
		ENV: 'DEV',
		INSTANCE: 'FIRST'
	}
});

// ENV = QA
module.exports.push({
	expression: '${ALL_APP_SERVER_INTERFACES}',
	result: ['autonomous1', 'criminal1', 'adrenaline2', 'prophetic2'],
	args: {
		ENV: 'QA'
	}
});

// ENV = PROD
module.exports.push({
	expression: '${ALL_APP_SERVER_INTERFACES}',
	result: ['hothead1', 'awakening1', 'dynamite1', 'military1', 'cuddly2', 'grease2', 'fate2', 'atmosphere2', 'drp-prod'],
	args: {
		ENV: 'PROD'
	}
});


// ENV = PROD, INSTANCE = SECOND
module.exports.push({
	expression: '${ALL_APP_SERVER_INTERFACES}',
	result: ['cuddly2', 'grease2', 'fate2', 'atmosphere2', 'drp-prod'],
	args: {
		ENV: 'PROD',
		INSTANCE: 'SECOND'
	}
});

// ENV = PROD, INSTANCE = XXX
module.exports.push({
	expression: '${ALL_APP_SERVER_INTERFACES}',
	result: ['hothead1', 'awakening1', 'dynamite1', 'military1', 'cuddly2', 'grease2', 'fate2', 'atmosphere2', 'drp-prod'],
	args: {
		ENV: 'PROD',
		INSTANCE: 'xxx'
	}
});

// ENV = PROD, INSTANCE = XXX
module.exports.push({
	expression: '${ALL_APP_SERVER_INTERFACES}',
	result: 'omg',
	args: {
		ENV: 'QA',
		INSTANCE: 'FIRST',
		HOSTS: {
			APP_SERVER_INTERFACES: {
				PROD: 'omg',
				QA: 'omg'
			}
		}
	}
});


// WS.URL1, ENV = LOCAL
module.exports.push({
	expression: '${WS.URL1}',
	result: ['http://test-url:9595/LOCAL', 'http://test-url:9696/LOCAL'],
	args: {
		ENV: 'LOCAL'
	}
});

// WS.URL1, ENV = PROD
module.exports.push({
	expression: '${WS.URL1}',
	result: 'http://test-url:8080/PROD',
	args: {
		ENV: 'PROD'
	}
});

// ALL_HOSTS_AND_PORTS1
module.exports.push({
	expression: '${ALL_HOSTS_AND_PORTS1&,}',
	result: 'hothead1[9595],awakening1[9595],dynamite1[9595],military1[9595],cuddly2[9595],grease2[9595],fate2[9595],atmosphere2[9595],zombie[9595],arrows[9595],zebra[9595],autonomous1[9595],criminal1[9595],adrenaline2[9595],prophetic2[9595],drp-prod[9595],yest[9595],jstaging[9595],hothead1[9696],awakening1[9696],dynamite1[9696],military1[9696],cuddly2[9696],grease2[9696],fate2[9696],atmosphere2[9696],zombie[9696],arrows[9696],zebra[9696],autonomous1[9696],criminal1[9696],adrenaline2[9696],prophetic2[9696],drp-prod[9696],yest[9696],jstaging[9696],hothead1[8080],awakening1[8080],dynamite1[8080],military1[8080],cuddly2[8080],grease2[8080],fate2[8080],atmosphere2[8080],zombie[8080],arrows[8080],zebra[8080],autonomous1[8080],criminal1[8080],adrenaline2[8080],prophetic2[8080],drp-prod[8080],yest[8080],jstaging[8080]'
});

// ALL_HOSTS_AND_PORTS2 ( PROD )
module.exports.push({
	expression: '${ALL_HOSTS_AND_PORTS2&,}',
	result: 'hothead1[8080],awakening1[8080],dynamite1[8080],military1[8080],cuddly2[8080],grease2[8080],fate2[8080],atmosphere2[8080],drp-prod[8080]',
	args: {
		ENV: 'PROD'
	}
});

// ALL_HOSTS_AND_PORTS2 ( YEST )
module.exports.push({
	expression: '${ALL_HOSTS_AND_PORTS2&,}',
	result: 'yest[8080]',
	args: {
		ENV: 'YEST'
	}
});

// makeUrls() function
module.exports.push({
	expression: '${makeUrls()}',
	result: {
		"PROD": ["http://hothead1", "http://awakening1", "http://dynamite1", "http://military1", "http://cuddly2", "http://grease2", "http://fate2", "http://atmosphere2"],
		"DEV": ["http://zombie", "http://arrows", "http://zebra"],
		"QA": ["http://autonomous1", "http://criminal1", "http://adrenaline2", "http://prophetic2"],
		"DRP-PROD": "http://drp-prod",
		"YEST": "http://yest",
		"STAGING": "http://jstaging"
	}
});

// resolve ENV by IFC
module.exports.push({
	expression: '${ENV}',
	result: 'SPECIAL',
	args: {
		IFC: 'iDeer'
	}
});

// DATABASE_DEF, IFC = hothead1
module.exports.push({
	expression: '${DATABASE_DEF}',
	result: '-DDB_NAME=PROD',
	args: {
		IFC: 'hothead1'
	}
});

// DATABASE_DEF, IFC = drp-prod
module.exports.push({
	expression: '${DATABASE_DEF}',
	result: '-DDB_NAME=DRP-PROD',
	args: {
		IFC: 'drp-prod'
	}
});

// DATABASE_DEF, IFC = iPromised
module.exports.push({
	expression: '${DATABASE_DEF}',
	result: '-DDB_NAME=iDB',
	args: {
		IFC: 'iPromised'
	}
});

// discoverInstance(), SECOND
module.exports.push({
	expression: '${discoverInstance(${IFC})}',
	result: 'SECOND',
	args: {
		IFC: 'grease2'
	}
});

// discoverInstance(), yest
module.exports.push({
	expression: '${discoverInstance(${IFC})}',
	result: null,
	args: {
		IFC: 'yest'
	}
});

// discoverInstance(), yest
module.exports.push({
	expression: '${discoverInstance(${IFC})}',
	result: null,
	args: {
		IFC: 'iMaximum'
	}
});

///////////////// Additional tests //////////////////
// escaping test
module.exports.push({
	expression: '${undefinedVar@\\${\\}\\\\\\}}',
	result: '${}\\}'
});

// Math.round() test
module.exports.push({
	expression: '${Math.round(${@1\\.1:num})}',
	result: 1
});

// parseInt() test
module.exports.push({
	expression: '${parseInt(${@123:num})}',
	result: 123
});

// parseFloat() test
module.exports.push({
	expression: '${parseFloat(${@123\\.456:num})}',
	result: 123.456
});

// function with multi params
module.exports.push({
	expression: '${multiParamsTest(${obj1}, ${arr1}, ${@something} )}',
	result: 'mint false something'
});

// function returns different results -> object
module.exports.push({
	expression: '${returnsObjectArrayFunction(${@object})}',
	result: {hello: 'world'}
});

// function returns different results -> array
module.exports.push({
	expression: '${returnsObjectArrayFunction(${@array})}',
	result: ['hello', 2017, 'world', true]
});

// function returns different results -> function
module.exports.push({
	expression: '${returnsObjectArrayFunction(${@function})()}',
	result: 'Okay;)'
});

// reserved actions
module.exports.push({
	expression: '${*?%>+}',
	throwsException: true
});

// # array operations action
module.exports.push({
	expression: '${arr1#F}',
	result: undefined
});

// # array operations action
module.exports.push({
	expression: '${arr5#F}',
	result: 'hello'
});

// # array operations action
module.exports.push({
	expression: '${arr6#F}',
	result: undefined
});

// # array operations action
module.exports.push({
	expression: '${arr1#S}',
	result: [79, false, "muscle", "queen"]
});

// # array operations action
module.exports.push({
	expression: '${arr1#s}',
	result: ["queen", "muscle", false, 79]
});

// # array operations action
module.exports.push({
	expression: '${arr4#U#S}',
	result: [16, 79, 99, "air", false, "muscle", "queen", "smooth", true, "true"]
});

// # array operations action
module.exports.push({
	expression: '${arr4#D}',
	result: ['queen', 79, false, true]
});

// # array operations action
module.exports.push({
	expression: '${arr6#D}',
	result: []
});

// # array operations action
module.exports.push({
	expression: '${arr6#D!E}',
	result: undefined
});

// # array operations action
module.exports.push({
	expression: '${@test#A-test}',
	result: []
});

// # array operations action
module.exports.push({
	expression: '${arr4#U#S#CNT}',
	result: 10,
	throwsException: true
});

// # array operations action
module.exports.push({
	expression: '${obj1<${@mint#A+righteous}}',
	result: ['beneficial', 'test']
});


// # array operations action
module.exports.push({
	expression: '${arr4#U#S#LEN}',
	result: 10
});

// - eliminate array elements
module.exports.push({
	expression: '${arr1-false}', // not eliminating, because false is string
	result: ['queen', 'muscle', 79, false]
});

// - eliminate array elements
module.exports.push({
	expression: '${fruits-${}-${@:null}}', // not eliminating, because false is string
	result: ['Mango', 'Lemon', 'Banana', 'Apple']
});

// - eliminate multiple
module.exports.push({
	expression: '${arr1-${@false:bool}-79-${@79:num}-queen}',
	result: ['muscle']
});

// - eliminate array elements ( eliminate itself )
module.exports.push({
	expression: '${arr1-${arr1}}',
	result: []
});

// - eliminate object properties
module.exports.push({
	expression: '${obj1-\\()-71-mint-price}',
	result: {beneficial: 'mint', test: 'righteous', disturbed: 46, pack: {strong: 'balance', deer: 7}}
});

// - eliminate object properties
module.exports.push({
	expression: '${obj1.pack-strong-deer}',
	result: {}
});

// # substring
module.exports.push({
	expression: '${longStr[0..29,${index}..999]& }',
	result: 'The distance to the work is 15 km'
});

// # substring
module.exports.push({
	expression: '${longStr[0..30,${strItem}..999]& }',
	throwsException: true
});

// default expression and default args
module.exports.push({
	result: 25
});

// default expression and default args
module.exports.push({
	args: {
		test1: 'omg'
	},
	result: 'omg'
});

// long object resolution
module.exports.push({
	expression: '${a.b.${undefinedVariable}.d}',
	result: undefined
});

// long object resolution
module.exports.push({
	expression: '${${xxx} .b.c.d}',
	throwsException: true
});

// long object resolution
module.exports.push({
	expression: '${obj1.pack.strong.balance}',
	result: 'balance'
});

// long object resolution
module.exports.push({
	expression: '${obj1.${undefinedVar}.pack.strong.${balance}}',
	result: 'balance'
});

// resolution from primitive
module.exports.push({
	expression: '${intItem.a.b.c}',
	result: 71
});

// when key is undefined
module.exports.push({
	expression: '${obj1.${undefinedVariable}~V&,} ${obj1.${undefinedVariable}.pack~V&,} ${obj1.${undefinedVariable}.pack~V&,}',
	result: 'berry,mint,righteous,trick,46,true,balance,7 balance,7 balance,7'
});

// when key is undefined#2
module.exports.push({
	expression: '${obj1.${undefinedVariable@:null}.pack~V&,}',
	result: undefined
});

// resolution from array
module.exports.push({
	expression: '${arr1.x.y.z}',
	result: ["queen", "muscle", 79, false]
});

// resolution from function
module.exports.push({
	expression: '${obj2.pack.wrapWithBrackets.x.y.z}',
	result: undefined
});

// mandatory value action
module.exports.push({
	expression: '${xxx*Not provided}',
	throwsException: true
});

// mandatory value action
module.exports.push({
	expression: '${obj2.pack.x.y.z*}',
	throwsException: true
});

// mandatory value action
module.exports.push({
	expression: '${obj1...71...x*}',
	result: 'berry'
});

// mandatory value action
module.exports.push({
	expression: '${obj1...71...*}',
	result: 'berry'
});

// mandatory value action
module.exports.push({
	expression: '${obj1~K~V~O<!E*}',
	throwsException: true
});

// mandatory value action
module.exports.push({
	expression: '${*}',
	throwsException: true
});

// external args test
module.exports.push({
	expression: '${HOSTS.APP_SERVER_INTERFACES.PROD.FIRST[0..1]}',
	args: {
		HOSTS: {
			APP_SERVER_INTERFACES: {
				PROD: {
					FIRST: 'omg'
				}
			}
		}
	},
	result: 'om'
});

// external args test
module.exports.push({
	expression: '${objArray1[0]}',
	args: {
		objArray1: 'test'
	},
	result: 't'
});

// external args test
module.exports.push({
	expression: '${obj1-${nexl.args.param1}}',
	args: {
		param1: ['price', 'beneficial', 'disturbed', '71', 'pack']
	},
	result: {test: 'righteous', '()': 'trick'}
});

// external args test
module.exports.push({
	expression: '${intItem}',
	args: {
		intItem: {
			a: 10
		}
	},
	result: {
		a: 10
	}
});

// external args test
module.exports.push({
	expression: '${intItem}',
	args: {
		intItem: null
	},
	result: null
});

// invalid function args test
module.exports.push({
	expression: '${someFunc(1)}',
	throwsException: true
});

// invalid array index
module.exports.push({
	expression: '${someArr[ok]}',
	throwsException: true
});

// nexl expression is not closed
module.exports.push({
	expression: '${',
	throwsException: true
});

// nexl expression is not closed
module.exports.push({
	expression: '${a.b.c.',
	throwsException: true
});

// bad action
module.exports.push({
	expression: '${~ ${}}',
	throwsException: true
});

// bad action
module.exports.push({
	expression: '${#A# ${}}',
	throwsException: true
});

// bad action
module.exports.push({
	expression: '${@^ ${}}',
	throwsException: true
});

// bad substitution
module.exports.push({
	expression: '${} hello',
	throwsException: true
});

// bad substitution
module.exports.push({
	expression: '${obj1} hello',
	throwsException: true
});

// expand object keys
module.exports.push({
	expression: '${obj4}',
	throwsException: true
});

// bad array index
module.exports.push({
	expression: '${arr1[${strItem}]}',
	throwsException: true
});

// bad array index
module.exports.push({
	expression: '${arr1[${Math.PI}]}',
	throwsException: true
});

// bad action
module.exports.push({
	expression: '${~Q}',
	throwsException: true
});

// bad action
module.exports.push({
	expression: '${arr1#Q}',
	throwsException: true
});

// bad action
module.exports.push({
	expression: '${strItem^Q}',
	throwsException: true
});

// join array elements
module.exports.push({
	expression: '${arr1&${}}',
	throwsException: true
});

// join array elements
module.exports.push({
	expression: '${arr1&${obj1}}',
	throwsException: true
});

// mandatory value action
module.exports.push({
	expression: '${*}',
	throwsException: true
});

// reserved actions
module.exports.push({
	expression: '${>}',
	throwsException: true
});

// reserved actions
module.exports.push({
	expression: '${%}',
	throwsException: true
});

// reserved actions
module.exports.push({
	expression: '${=}',
	throwsException: true
});

// reserved actions
module.exports.push({
	expression: '${?}',
	throwsException: true
});

// this
module.exports.push({
	expression: '${__this__.intItem}',
	result: undefined
});

// this
module.exports.push({
	expression: '${obj7}',
	result: {
		home: '/home/nexl',
		backupDir: '/home/nexl/backup',
		runsDir: '/home/nexl/runs',
		start: '/home/nexl/runs/run.sh',
		x: ['/home/nexl/runs', 71, '/home/nexl/runs/run.sh', '/home/nexl'],
		y: {home: 'Earth', a: 'Earth'}
	}
});

// merge object with override + this
module.exports.push({
	expression: '${obj7+${obj8}}',
	result: {
		home: '/sweetHome',
		backupDir: '/sweetHome/backup',
		runsDir: '/sweetHome/runs',
		start: '/sweetHome/runs/run.sh',
		x: ['/sweetHome/runs', 71, '/sweetHome/runs/run.sh', '/home/nexl'],
		y: {home: 'Earth', a: 'Earth'}
	}
});

// merge object with override + this
module.exports.push({
	expression: '${obj7+${obj8}}',
	args: {
		obj7: {
			home: 'c:\\temp\\'
		}
	},
	result: {
		home: '/sweetHome',
		backupDir: '/sweetHome/backup',
		runsDir: '/sweetHome/runs',
		start: '/sweetHome/runs/run.sh',
		x: ['/sweetHome/runs', 71, '/sweetHome/runs/run.sh', 'c:\\temp\\'],
		y: {home: 'Earth', a: 'Earth'}
	}
});

// merge object with override + this
module.exports.push({
	expression: '${obj7+${obj8}}',
	args: {
		obj8: {
			home: 'c:\\temp\\'
		}
	},
	result: {
		home: 'c:\\temp\\',
		backupDir: 'c:\\temp\\/backup',
		runsDir: 'c:\\temp\\/runs',
		start: 'c:\\temp\\/runs/run.sh',
		x: ['c:\\temp\\/runs', 71, 'c:\\temp\\/runs/run.sh', '/home/nexl'],
		y: {home: 'Earth', a: 'Earth'}
	}
});


// this, parent
module.exports.push({
	expression: '${obj9}',
	result: {
		level: 1,
		"home": "/home/nexl",
		"this1": "/home/nexl",
		"this2": "/home/nexl",
		"parent3": {
			level: 2,
			"a1": "/home/nexl",
			"a2": "/home/nexl",
			"a3": "/home/nexl",
			"x": 10,
			"inner": {
				level: 3, "b1": 10, "b2": 10, "b3": "/home/nexl"
			}
		}
	}
});

// this, parent
module.exports.push({
	expression: '${obj10}',
	result: {
		home: '/home/jboss',
		backupDir: '/home/jboss/BACKUP',
		inner: {x1: '/home/jboss/BACKUP', x2: 10, x3: 10, x4: '/home/jboss/BACKUP'}
	}
});

// this, parent
module.exports.push({
	expression: '${obj11}',
	result: {"home": "/home/jboss", "inner": {"a": "/home/jboss"}}
});

// this, parent
module.exports.push({
	expression: '${dirs}',
	result: {
		level: 1,
		home: '/home/Zhenya',
		logs: '/home/Zhenya/logs',
		cgLog: '/home/Zhenya/logs/cg.log',
		debugLogs: {
			level: 2,
			log1: '/home/Zhenya',
			log2: '/home/Zhenya/logs/cg.log',
			internal: {
				level: 3,
				log1: '/home/Zhenya',
				log2: '/home/Zhenya/logs/cg.log',
				log3: '/home/Zhenya',
				log4: '/home/Zhenya/logs/cg.log',
				log5: '/home/Zhenya/logs/cg.log'
			},
			internal2: {
				level: 3,
				log5: '/home/Zhenya',
				log6: '/home/Zhenya/logs/cg.log'
			}
		}
	}
});

// this, parent
module.exports.push({
	expression: '${dirs._this_._this_}',
	result: {
		level: 1,
		home: '/home/Zhenya',
		logs: '/home/Zhenya/logs',
		cgLog: '/home/Zhenya/logs/cg.log',
		debugLogs: {
			level: 2,
			log1: '/home/Zhenya',
			log2: '/home/Zhenya/logs/cg.log',
			internal: {
				level: 3,
				log1: '/home/Zhenya',
				log2: '/home/Zhenya/logs/cg.log',
				log3: '/home/Zhenya',
				log4: '/home/Zhenya/logs/cg.log',
				log5: '/home/Zhenya/logs/cg.log'
			},
			internal2: {
				level: 3,
				log5: '/home/Zhenya',
				log6: '/home/Zhenya/logs/cg.log'
			}
		}
	}
});

// this, parent
module.exports.push({
	expression: '${dirs.__this__.__parent__}',
	result: undefined
});

// this, parent
module.exports.push({
	expression: '${dirs.logs}',
	result: '/home/Zhenya/logs'
});

// this, parent
module.exports.push({
	expression: '${dirs.cgLog}',
	result: '/home/Zhenya/logs/cg.log'
});

// this, parent
module.exports.push({
	expression: '${dirs.debugLogs}',
	result: {
		level: 2,
		log1: '/home/Zhenya',
		log2: '/home/Zhenya/logs/cg.log',
		internal: {
			level: 3,
			log1: '/home/Zhenya',
			log2: '/home/Zhenya/logs/cg.log',
			log3: '/home/Zhenya',
			log4: '/home/Zhenya/logs/cg.log',
			log5: '/home/Zhenya/logs/cg.log'
		},
		internal2: {
			level: 3,
			log5: '/home/Zhenya',
			log6: '/home/Zhenya/logs/cg.log'
		}
	}
});

// this, parent
module.exports.push({
	expression: '${dirs.debugLogs.internal2}',
	result: {
		level: 3,
		log5: '/home/Zhenya',
		log6: '/home/Zhenya/logs/cg.log'
	}
});

// this, parent
module.exports.push({
	expression: '${dirs.debugLogs.log1}',
	result: '/home/Zhenya'
});

// this, parent
module.exports.push({
	expression: '${dirs.debugLogs.log2}',
	result: '/home/Zhenya/logs/cg.log'
});

// this, parent
module.exports.push({
	expression: '${dirs.debugLogs.internal.log1}',
	result: '/home/Zhenya'
});

// this, parent
module.exports.push({
	expression: '${dirs.debugLogs.internal.log2}',
	result: '/home/Zhenya/logs/cg.log'
});

// this, parent
module.exports.push({
	expression: '${dirs.debugLogs.internal.log3}',
	result: '/home/Zhenya'
});

// this, parent
module.exports.push({
	expression: '${dirs.debugLogs.internal.log4}',
	result: '/home/Zhenya/logs/cg.log'
});

// this, parent
module.exports.push({
	expression: '${dirs.debugLogs.internal.log5}',
	result: '/home/Zhenya/logs/cg.log'
});

// this, parent
module.exports.push({
	expression: '${dirs.debugLogs.internal2.log5}',
	result: '/home/Zhenya'
});

// this, parent
module.exports.push({
	expression: '${dirs.debugLogs.internal2.log6}',
	result: '/home/Zhenya/logs/cg.log'
});

// this, parent
module.exports.push({
	expression: '${__this__}',
	result: undefined
});

// this, parent
module.exports.push({
	expression: '${__this__.__this__}',
	result: undefined
});

// this, parent
module.exports.push({
	expression: '${__parent__}',
	result: undefined
});

// this, parent
module.exports.push({
	expression: '${__parent__.__parent__}',
	result: undefined
});

// this, parent
module.exports.push({
	expression: '${obj15}',
	result: {a: 10, b: [10, 11, 'hello']}
});

// this, parent
module.exports.push({
	expression: '${intItem|__this__}',
	result: undefined
});

// this, parent
module.exports.push({
	expression: '${intItem|__parent__}',
	result: undefined
});

// this, parent
module.exports.push({
	expression: '${objItem|__this__}',
	result: undefined
});

// this, parent
module.exports.push({
	expression: '${objItem|__parent__}',
	result: undefined
});

// this, parent
module.exports.push({
	expression: '${deepThisTest.c}',
	result: true
});

// this, parent
module.exports.push({
	expression: '${deepThisTest.d}',
	result: [1, 2, 3]
});

// this, parent
module.exports.push({
	expression: '${deepThisTest.e.f}',
	result: true
});

// this, parent
module.exports.push({
	expression: '${deepThisTest.e.g}',
	result: false
});

// this, parent
module.exports.push({
	expression: '${intItem|dirs.debugLogs.internal2.log6}',
	result: '/home/Zhenya/logs/cg.log'
});

// this, parent
module.exports.push({
	expression: '${obj1.${items}}',
	result: [undefined,
		undefined,
		{
			'71': 'berry',
			beneficial: 'mint',
			test: 'righteous',
			'()': 'trick',
			disturbed: 46,
			price: true,
			pack: {strong: 'balance', deer: 7}
		},
		undefined,
		{
			'71': 'berry',
			beneficial: 'mint',
			test: 'righteous',
			'()': 'trick',
			disturbed: 46,
			price: true,
			pack: {strong: 'balance', deer: 7}
		},
		undefined,
		undefined,
		'berry',
		'berry']

});

// this, parent
module.exports.push({
	expression: '${dirs.debugLogs.internal._parent_~K}',
	result: ["level", "log1", "log2", "internal", "internal2"]
});

// this, parent
module.exports.push({
	expression: '${dirs._this_~K}',
	result: ["level", "home", "logs", "cgLog", "debugLogs"]
});

// escaping test
module.exports.push({
	expression: '${obj1.\\()}',
	result: 'trick'
});

// mixed actions test
module.exports.push({
	expression: '${HOSTS~K&,#A+item1+${arr1}+${@49:num}~O***.HOSTS[0][0..20]}',
	result: 'APP_SERVER_INTERFACES'
});

// array indexes test
module.exports.push({
	expression: '${arr1+${arr2}[^]}',
	result: 'queen'
});

// array indexes test
module.exports.push({
	expression: '${arr1+${arr2}[^^]}',
	throwsException: true
});

// array indexes test
module.exports.push({
	expression: '${arr1+${arr2}[hello]}',
	throwsException: true
});

// array indexes test
module.exports.push({
	expression: '${arr1+${arr2}[$]}',
	result: 'smooth'
});

// array indexes test
module.exports.push({
	expression: '${arr1+${arr2}[^..$]}',
	result: ["queen", "muscle", 79, false, "air", 16, 99, true, "smooth"]
});

// array indexes test
module.exports.push({
	expression: '${arr1+${arr2}[^..1]&,}',
	result: 'queen,muscle'
});

// array indexes test
module.exports.push({
	expression: '${arr1+${arr2}[5..$]&,}',
	result: '16,99,true,smooth'
});

// array indexes test
module.exports.push({
	expression: '${arr1+${arr2}[^..-1]&,}',
	result: 'queen,muscle,79,false,air,16,99,true'
});

// array indexes test
module.exports.push({
	expression: '${arr1+${arr2}[$..$]&,}',
	result: 'smooth'
});

// array indexes test
module.exports.push({
	expression: '${arr1+${arr2}[^..^]&,}',
	result: 'queen'
});

// array indexes test
module.exports.push({
	expression: '${arr1+${arr2}[-1..$]&,}',
	result: 'true,smooth'
});

// array indexes test
module.exports.push({
	expression: '${arr1+${arr2}[4..-1]&,}',
	result: 'air,16,99,true'
});

// array indexes test
module.exports.push({
	expression: '${arr1+${arr2}[0..${undefinedVar}]&,}',
	throwsException: true
});

// array indexes test
module.exports.push({
	expression: '${arr1+${arr2}[  ${@$}..${@\\^} ]&,}',
	result: undefined
});

// array indexes test
module.exports.push({
	expression: '${arr1+${arr2}[ 0..${obj1} ]&,}',
	throwsException: true
});

// array indexes test
module.exports.push({
	expression: '${arr1+${arr2}[ 0..--1 ]&,}',
	throwsException: true
});

// array indexes test
module.exports.push({
	expression: '${arr1+${arr2}[ 0..1,    2..3    , -1..-1 , $ ]&,}',
	result: 'queen,muscle,79,false,true,smooth'
});

// array indexes test
module.exports.push({
	expression: '${arr1[${@\\-1:num}]}',
	result: 79
});

// string cut test
module.exports.push({
	expression: '${@j1test2[$]}',
	result: '2'
});

// string cut test
module.exports.push({
	expression: '${@j1test2[^..1]}',
	result: 'j1'
});

// string cut test
module.exports.push({
	expression: '${@j1test2[^..^]}',
	result: 'j'
});

// evaluate as undefined for root expression
module.exports.push({
	expression: 'hello ${world}',
	args: {
		nexl: {
			EVALUATE_TO_UNDEFINED: true
		}
	},
	result: undefined
});

// default args
module.exports.push({
	expression: '${intItem2}',
	result: 46
});

// default args
module.exports.push({
	expression: '${intItem3}',
	result: 57
});

// default args
module.exports.push({
	expression: '${intItem2}',
	args: {
		intItem2: 111
	},
	result: 111
});

// default args
module.exports.push({
	expression: '${intItem3}',
	args: {
		intItem2: 333
	},
	result: 57
});

// default args
module.exports.push({
	expression: '${intItem3}',
	args: {
		intItem3: 333
	},
	result: 333
});

// ~X
module.exports.push({
	expression: '${obj5~X}',
	result: "<?xml version='1.0'?>\n<obj5>\n    <beneficial>mint</beneficial>\n    <pack>\n        <strong>balance</strong>\n        <deer>7</deer>\n    </pack>\n    <obj3>\n        <item1>test</item1>\n        <item2>undefined</item2>\n        <item3>34</item3>\n    </obj3>\n    <berry>71</berry>\n    <test>undefined</test>\n</obj5>"
});

// ~X
module.exports.push({
	expression: '${HOSTS~X}',
	result: "<?xml version='1.0'?>\n<HOSTS>\n    <APP_SERVER_INTERFACES>\n        <PROD>\n            <FIRST>hothead1</FIRST>\n            <FIRST>awakening1</FIRST>\n            <FIRST>dynamite1</FIRST>\n            <FIRST>military1</FIRST>\n            <SECOND>cuddly2</SECOND>\n            <SECOND>grease2</SECOND>\n            <SECOND>fate2</SECOND>\n            <SECOND>atmosphere2</SECOND>\n        </PROD>\n        <DEV>zombie</DEV>\n        <DEV>arrows</DEV>\n        <DEV>zebra</DEV>\n        <QA>\n            <FIRST>autonomous1</FIRST>\n            <FIRST>criminal1</FIRST>\n            <SECOND>adrenaline2</SECOND>\n            <SECOND>prophetic2</SECOND>\n        </QA>\n        <DRP-PROD>drp-prod</DRP-PROD>\n        <YEST>yest</YEST>\n        <STAGING>jstaging</STAGING>\n    </APP_SERVER_INTERFACES>\n    <INTERNET_INTERFACES>\n        <PROD>iMaximum</PROD>\n        <PROD>iPromised</PROD>\n        <PROD>iPilot</PROD>\n        <DEV>iHomeland</DEV>\n        <QA>iTruth</QA>\n        <QA>iSilver</QA>\n        <YEST>iYest</YEST>\n        <STAGING>iStaging</STAGING>\n        <SPECIAL>iDeer</SPECIAL>\n    </INTERNET_INTERFACES>\n</HOSTS>"
});


// ~P
module.exports.push({
	expression: '${obj5~P}',
	result: "beneficial=mint\npack.strong=balance\npack.deer=7\nobj3.item1=test\nobj3.item2=undefined\nobj3.item3=34\nberry=71\ntest=undefined"
});

// ~P
module.exports.push({
	expression: '${HOSTS~P}',
	result: "APP_SERVER_INTERFACES.PROD.FIRST=hothead1,awakening1,dynamite1,military1\nAPP_SERVER_INTERFACES.PROD.SECOND=cuddly2,grease2,fate2,atmosphere2\nAPP_SERVER_INTERFACES.DEV=zombie,arrows,zebra\nAPP_SERVER_INTERFACES.QA.FIRST=autonomous1,criminal1\nAPP_SERVER_INTERFACES.QA.SECOND=adrenaline2,prophetic2\nAPP_SERVER_INTERFACES.DRP-PROD=drp-prod\nAPP_SERVER_INTERFACES.YEST=yest\nAPP_SERVER_INTERFACES.STAGING=jstaging\nINTERNET_INTERFACES.PROD=iMaximum,iPromised,iPilot\nINTERNET_INTERFACES.DEV=iHomeland\nINTERNET_INTERFACES.QA=iTruth,iSilver\nINTERNET_INTERFACES.YEST=iYest\nINTERNET_INTERFACES.STAGING=iStaging\nINTERNET_INTERFACES.SPECIAL=iDeer"
});


// ~Y
module.exports.push({
	expression: '${obj5~Y}',
	result: "beneficial: mint\npack:\n    strong: balance\n    deer: 7\nobj3:\n    item1: test\n    item2: null\n    item3: 34\nberry: 71\ntest: null\n"
});

// ~Y
module.exports.push({
	expression: '${HOSTS~Y}',
	result: "APP_SERVER_INTERFACES:\n    PROD: {FIRST: [hothead1, awakening1, dynamite1, military1], SECOND: [cuddly2, grease2, fate2, atmosphere2]}\n    DEV: [zombie, arrows, zebra]\n    QA: {FIRST: [autonomous1, criminal1], SECOND: [adrenaline2, prophetic2]}\n    DRP-PROD: drp-prod\n    YEST: yest\n    STAGING: jstaging\nINTERNET_INTERFACES:\n    PROD: [iMaximum, iPromised, iPilot]\n    DEV: iHomeland\n    QA: [iTruth, iSilver]\n    YEST: iYest\n    STAGING: iStaging\n    SPECIAL: iDeer\n"
});

// sub expressions
module.exports.push({
	expression: '${expr1}',
	result: [{
		'71': 'berry',
		beneficial: 'mint',
		test: 'righteous',
		'()': 'trick',
		disturbed: 46,
		price: true,
		pack: {strong: 'balance', deer: 7}
	},
		'${obj1}',
		'queen',
		'muscle',
		79,
		false,
		71,
		1,
		'2',
		true]
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// testing system functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.push({
	expression: '${makeObj()}',
	result: {}
});

module.exports.push({
	expression: '${@|makeObj()}',
	result: {'': undefined}
});

module.exports.push({
	expression: '${arr1|intItem|makeObj()}',
	result: {'79': 71, queen: 71, muscle: 71, false: 71}
});

module.exports.push({
	expression: '${|not()~Y}',
	result: 'Zhenya++'
});

module.exports.push({
	expression: '${@true:bool|nexl.functions.system.not()~Y}',
	result: false
});

module.exports.push({
	expression: '${|testFunc1()}',
	result: 'testFunc1'
});

module.exports.push({
	expression: '${|nexl.functions.user.testFunc1()}',
	result: 'user.testFunc1'
});

module.exports.push({
	expression: '${|testFunc2()}',
	result: 'user.testFunc2'
});

module.exports.push({
	expression: '${|testFunc3()}',
	result: 'testFunc3'
});

module.exports.push({
	expression: '${arr8|isContains()}',
	result: 'Zhenya+'
});

module.exports.push({
	expression: '${arr8|nexl.functions.system.isContains(${intItem})}',
	result: true
});

module.exports.push({
	expression: '${arr8|replaceAll( ${intItem}, ${boolItem} )|replaceAll( ${@a}, ${@101:num} )}',
	result: [true, 10, 101, true]
});

module.exports.push({
	expression: '${intItem|boolItem|isEquals()}',
	result: false
});

module.exports.push({
	expression: '${arr8|intItem|@lol|@omg|ifContains()}',
	result: 'lol'
});

module.exports.push({
	expression: '${arr8|@|@lol|@omg|ifContains()}',
	result: 'omg'
});

module.exports.push({
	expression: '${ifContains( ${arr8}, ${intItem}, ${@ok}, ${@notOk} )}',
	result: 'ok'
});

module.exports.push({
	expression: '${ifContains( ${arr8}, ${strItem}, ${@ok}, ${obj1.pack} )}',
	result: {"strong": "balance", "deer": 7}
});

module.exports.push({
	expression: '${ifContains( ${arr8}, ${strItem}, ${@ok}, ${obj1.pack|} )}',
	result: undefined
});

module.exports.push({
	expression: '${ifContains( ${arr8}, ${strItem}, ${@ok}, ${obj1.pack~V|nexl.functions.system.isContains( ${@7:num} )} )}',
	result: true
});

module.exports.push({
	expression: '${isUndefined()}',
	result: true
});

module.exports.push({
	expression: '${@|isUndefined()}',
	result: false
});

module.exports.push({
	expression: '${@|isBool()}',
	result: false
});

module.exports.push({
	expression: '${@1:num:bool|isBool()}',
	result: true
});

module.exports.push({
	expression: '${@1:num:bool|isStr()}',
	result: false
});

module.exports.push({
	expression: '${@|isStr()}',
	result: true
});

module.exports.push({
	expression: '${@|isPrimitive()}',
	result: true
});

module.exports.push({
	expression: '${:null|isNull()}',
	result: true
});

module.exports.push({
	expression: '${obj1|isObject()}',
	result: true
});

module.exports.push({
	expression: '${arr1|isObject()}',
	result: false
});

module.exports.push({
	expression: '${obj1|isArray()}',
	result: false
});

module.exports.push({
	expression: '${arr1|isArray()}',
	result: true
});

module.exports.push({
	expression: '${@|ifBool( ${intItem}, ${strItem} )}',
	result: 'berry'
});

module.exports.push({
	expression: '${@true:bool|ifBool( ${intItem}, ${strItem} )}',
	result: 71
});

module.exports.push({
	expression: '${@true|ifStr( ${arr1}, ${arr2} )}',
	result: ['queen', 'muscle', 79, false]
});

module.exports.push({
	expression: '${|ifStr( ${arr1}, ${arr2} )}',
	result: ['air', 16, 99, true, 'smooth']
});

module.exports.push({
	expression: '${obj1|ifNum( ${@hello}, ${@world} )}',
	result: 'world'
});

module.exports.push({
	expression: '${intItem|ifNum( ${@hello}, ${@world} )}',
	result: 'hello'
});

module.exports.push({
	expression: '${intItem|ifNum( ${obj1}, ${obj2} )}',
	result: {
		"71": "berry",
		"beneficial": "mint",
		"test": "righteous",
		"()": "trick",
		"disturbed": 46,
		"price": true,
		"pack": {"strong": "balance", "deer": 7}
	}
});

module.exports.push({
	expression: '${intItem|ifNull( ${@hello}, ${@world} )}',
	result: 'world'
});

module.exports.push({
	expression: '${:null|ifNull( ${@hello}, ${@world} )}',
	result: 'hello'
});

module.exports.push({
	expression: '${|ifUndefined( ${@hello}, ${@world} )}',
	result: 'hello'
});

module.exports.push({
	expression: '${@|ifUndefined( ${@hello}, ${@world} )}',
	result: 'world'
});

module.exports.push({
	expression: '${|ifPrimitive( ${@hello}, ${@world} )}',
	result: 'world'
});

module.exports.push({
	expression: '${@|ifPrimitive( ${@hello}, ${@world} )}',
	result: 'hello'
});

module.exports.push({
	expression: '${arr1|ifArray( ${@hello}, ${@world} )}',
	result: 'hello'
});

module.exports.push({
	expression: '${obj1|ifArray( ${@hello}, ${@world} )}',
	result: 'world'
});

module.exports.push({
	expression: '${arr1|ifObject( ${@hello}, ${@world} )}',
	result: 'world'
});

module.exports.push({
	expression: '${obj1|ifObject( ${@hello}, ${@world} )}',
	result: 'hello'
});

module.exports.push({
	expression: '${@a|@b|isEq()}',
	result: false
});

module.exports.push({
	expression: '${@b|@b|isEq()}',
	result: true
});

module.exports.push({
	expression: '${@b|@b|isGT()}',
	result: false
});

module.exports.push({
	expression: '${@c|@b|isGT()}',
	result: true
});

module.exports.push({
	expression: '${@c|@b|isLT()}',
	result: false
});

module.exports.push({
	expression: '${@a|@b|isLT()}',
	result: true
});

module.exports.push({
	expression: '${@b|@b|isLE()}',
	result: true
});

module.exports.push({
	expression: '${@c|@b|isLE()}',
	result: false
});

module.exports.push({
	expression: '${@b|@b|isGE()}',
	result: true
});

module.exports.push({
	expression: '${@a|@b|isGE()}',
	result: false
});

module.exports.push({
	expression: '${@b|@b|ifGT( ${intItem}, ${strItem} )}',
	result: 'berry'
});

module.exports.push({
	expression: '${@c|@b|ifGT( ${intItem}, ${strItem} )}',
	result: 71
});

module.exports.push({
	expression: '${@c|@b|ifLT( ${intItem}, ${strItem} )}',
	result: 'berry'
});

module.exports.push({
	expression: '${@a|@b|ifLT( ${intItem}, ${strItem} )}',
	result: 71
});

module.exports.push({
	expression: '${@b|@b|ifLE( ${intItem}, ${strItem} )}',
	result: 71
});

module.exports.push({
	expression: '${@c|@b|ifLE( ${intItem}, ${strItem} )}',
	result: 'berry'
});

module.exports.push({
	expression: '${@b|@b|ifGE( ${intItem}, ${strItem} )}',
	result: 71
});

module.exports.push({
	expression: '${@a|@b|ifGE( ${intItem}, ${strItem} )}',
	result: 'berry'
});

// setObjVal
module.exports.push({
	expression: '${obj1|@price|@99:num|setObjVal()}',
	result: {
		"71": "berry",
		"beneficial": "mint",
		"test": "righteous",
		"()": "trick",
		"disturbed": 46,
		"price": 99,
		"pack": {"strong": "balance", "deer": 7}
	}
});

module.exports.push({
	expression: '${obj1|@71|strItem|setObjKey()}',
	result: {
		beneficial: 'mint',
		test: 'righteous',
		'()': 'trick',
		disturbed: 46,
		price: true,
		pack: {strong: 'balance', deer: 7},
		berry: 'berry'
	}
});

module.exports.push({
	expression: '${longStr|@distance\\.\\*km|isMatch()}',
	result: true
});

module.exports.push({
	expression: '${longStr|@Distance\\.\\*km|@i|isMatch()}',
	result: true
});

module.exports.push({
	expression: '${longStr|@distance\\.\\*km|ifMatch( ${intItem}, ${strItem} )}',
	result: 71
});

module.exports.push({
	expression: '${longStr|@Distance\\.\\*km|@i|ifMatchEx( ${intItem}, ${strItem} )}',
	result: 71
});

module.exports.push({
	expression: '${@hello world 2017|@\\d$|ifNMatch( ${intItem}, ${strItem} )}',
	result: 'berry'
});

module.exports.push({
	expression: '${@hello world 2017|@World|@i|ifNMatchEx( ${intItem}, ${strItem} )}',
	result: 'berry'
});

module.exports.push({
	expression: '${@I love Japan|@Tokyo|ifNContains( ${intItem}, ${strItem} )}',
	result: 71
});

module.exports.push({
	expression: '${intItem|@25:num|ifNEquals( ${@true}, ${@false} )}',
	result: 'true'
});

module.exports.push({
	expression: '${intItem|@25:num|ifNEq( ${@true}, ${@false} )}',
	result: 'true'
});

module.exports.push({
	expression: '${intItem|ifNBool( ${@true}, ${@false} )}',
	result: 'true'
});

module.exports.push({
	expression: '${obj1|ifNStr( ${@true}, ${@false} )}',
	result: 'true'
});

module.exports.push({
	expression: '${arr1|ifNNum( ${@true}, ${@false} )}',
	result: 'true'
});

module.exports.push({
	expression: '${arr1|ifNNull( ${@true}, ${@false} )}',
	result: 'true'
});

module.exports.push({
	expression: '${arr1|ifNUndefined( ${@true}, ${@false} )}',
	result: 'true'
});

module.exports.push({
	expression: '${arr1|ifNNaN( ${@true}, ${@false} )}',
	result: 'true'
});

module.exports.push({
	expression: '${arr1|ifNPrimitive( ${@true}, ${@false} )}',
	result: 'true'
});

module.exports.push({
	expression: '${arr1|ifNArray( ${@true}, ${@false} )}',
	result: 'false'
});

module.exports.push({
	expression: '${arr1|ifNObject( ${@true}, ${@false} )}',
	result: 'true'
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// math functions tests
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.push({
	expression: '${intItem|inc()}',
	result: 72
});

module.exports.push({
	expression: '${intItem|inc( ${@99:num} )}',
	result: 170
});

module.exports.push({
	expression: '${intItem|dec()}',
	result: 70
});

module.exports.push({
	expression: '${intItem|dec( ${@99:num} )}',
	result: -28
});

module.exports.push({
	expression: '${intItem|div()}',
	result: 71
});

module.exports.push({
	expression: '${@100:num|@25:num|div()}',
	result: 4
});

module.exports.push({
	expression: '${@9:num|@4:num|div()}',
	result: 2.25
});

module.exports.push({
	expression: '${@9:num|@4:num|mod()}',
	result: 1
});

module.exports.push({
	expression: '${strItem|inc()}',
	result: 'berry'
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// testing nexl sources
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.push({
	throwsException: true,
	nexlSource: '...'
});

module.exports.push({
	throwsException: true,
	nexlSource: {asFile: {}, asText: {}}
});

module.exports.push({
	expression: '${abc}',
	result: 1979,
	nexlSource: {asText: {text: 'abc=1979;'}}
});

module.exports.push({
	throwsException: true,
	nexlSource: {asText: {text: '"@ nexl-sources/nexl-source1.js";'}}
});

module.exports.push({
	expression: '${strItem}',
	result: 'berry',
	nexlSource: {asText: {text: '"@ nexl-sources/nexl-source1.js";', path4imports: '.'}}
});

module.exports.push({
	expression: '${y}',
	result: 11,
	nexlSource: {asFile: {fileName: 'nexl-sources/src1.js'}}
});

module.exports.push({
	throwsException: true,
	nexlSource: {asFile: {fileName: 'c:\\111\\222.js'}}
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// testing typecast
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.push({
	expression: '${:omg}',
	throwsException: true
});

// casting
module.exports.push({
	expression: '${obj6:num}',
	result: {
		pack: 'good',
		item1: 79,
		item2: 71
	}
});

module.exports.push({
	expression: '${@1:num}',
	result: 1
});

module.exports.push({
	expression: '${@1:str}',
	result: '1'
});

module.exports.push({
	expression: '${@1:bool}',
	result: undefined
});

module.exports.push({
	expression: '${@true:bool}',
	result: true
});

module.exports.push({
	expression: '${@${intItem}:bool}',
	result: true
});

module.exports.push({
	expression: '${@1:null}',
	result: null
});

module.exports.push({
	expression: '${@${strItem}:undefined}',
	result: undefined
});

module.exports.push({
	expression: '${@1:n}',
	result: null
});

module.exports.push({
	expression: '${@${strItem}:u}',
	result: undefined
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// string operations
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.push({
	expression: '${longStr^U}',
	result: 'THE DISTANCE TO THE WORK IS 155 KM'
});

module.exports.push({
	expression: '${longStr^L^U1}',
	result: 'The distance to the work is 155 km'
});

module.exports.push({
	expression: '${longStr^L}',
	result: 'the distance to the work is 155 km'
});

module.exports.push({
	expression: '${strForTrim^T^L}',
	result: 'the distance to the work is 155 km'
});

module.exports.push({
	expression: '${strForTrim^T^L^LEN}',
	result: 34
});

module.exports.push({
	expression: '${strItem^S}',
	result: '"berry"'
});

module.exports.push({
	expression: '${arr1^S}',
	result: '["queen","muscle",79,false]'
});

module.exports.push({
	expression: '${obj1^S}',
	result: '{"beneficial":"mint","test":"righteous","()":"trick","disturbed":46,"price":true,"pack":{"strong":"balance","deer":7},"71":"berry"}'
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// append to array, merge objects, concat strings
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.push({
	expression: '${arr1+test&,}',
	result: 'queen,muscle,79,false,test'
});

module.exports.push({
	expression: '${arr1+${obj1~K}-price&,}',
	result: 'queen,muscle,79,false,71,beneficial,test,(),disturbed,pack'
});

module.exports.push({
	expression: '${arr1+\\\\\\${&\\${}',
	result: 'queen${muscle${79${false${${'
});

module.exports.push({
	expression: '${arr1+${intItem}}',
	result: ['queen', 'muscle', 79, false, 71]
});

module.exports.push({
	expression: '${arr1+\\\\\\${intItem\\}}',
	result: ['queen', 'muscle', 79, false, '${intItem}']
});

module.exports.push({
	expression: '${obj1+${obj6}}',
	result: {
		'71': 'berry',
		beneficial: 'mint',
		test: 'righteous',
		'()': 'trick',
		disturbed: 46,
		price: true,
		pack: 'good',
		item1: 79,
		item2: 71
	}
});

module.exports.push({
	expression: '${strItem+\\-+${strItem}+${intItem}}',
	result: 'berry-berry71'
});

module.exports.push({
	expression: '${intItem+intItem}',
	result: '71intItem'
});

module.exports.push({
	expression: '${boolItem+${intItem}}',
	result: 'true71'
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// iteration tests
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.push({
	expression: '${largestCountries[]${_item_.name}}',
	result: ["Russia", "Canada", "USA", "China"]
});

module.exports.push({
	expression: '${largestCountries[]${_index_:str+\\-+${_item_.name}+,+${_item_.population}+,+${_item_.capital}}}',
	result: ["0-Russia,144498215,Moscow", "1-Canada,35151728,Ottawa", "2-USA,324987000,Washington, D.C.", "3-China,1373541278,Beijing"]
});

module.exports.push({
	expression: '${largestCountries[]${_item_.capital|@a|_item_|ifMatch()}-${}[]${_item_~P&}&\n}',
	result: 'name=Canada\ncapital=Ottawa\npopulation=35151728\nname=USA\ncapital=Washington, D.C.\npopulation=324987000'
});

module.exports.push({
	expression: '${arr1[]${_item_+OMG}}',
	result: ["queenOMG", "muscleOMG", '79OMG', 'falseOMG']
});

module.exports.push({
	expression: '${arr1[]${_item_|ifStr( ${_item_} )}-${}}',
	result: ["queen", "muscle"]
});

module.exports.push({
	expression: '${arr1[]${_item_:str[0]}&,+\n+${arr1&,}}',
	result: 'q,m,7,f\nqueen,muscle,79,false'
});

module.exports.push({
	expression: '${arr1[0..1]${_item_:str^LEN}&}',
	result: '56'
});

module.exports.push({
	expression: '${arr1[${@\\^}..0]${_item_:str^LEN}&}',
	result: 'queen'
});

module.exports.push({
	expression: '${arr1[]}',
	result: ["queen", "muscle", 79, false]
});

module.exports.push({
	expression: '${obj6[]}',
	result: {"pack": "good", "item1": 79, "item2": 71}
});

module.exports.push({
	expression: '${obj6[]${_key_+\\.\\.${_value_}}&\n}',
	result: 'pack..good\nitem1..79\nitem2..71'
});

module.exports.push({
	expression: '${intItem[]${}}',
	result: 71
});