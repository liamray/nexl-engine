/**************************************************************************************
 nexl-engine-utils

 Copyright (c) 2016-2017 Yevgeny Sergeyev
 License : Apache 2.0
 WebSite : http://www.nexl-js.com

 Set of utility functions for nexl-engine
 **************************************************************************************/

const nexlExpressionsParser = require('./nexl-expressions-parser');
const nexlSourceUtils = require('./nexl-source-utils');
const nexlSystemFuncs = require('./nexl-functoins');
const j79 = require('j79-utils');
const deepMerge = require('deepmerge');
const util = require('util');
const winston = j79.winston;

const SPECIAL_CHARS_MAP = {
	'\\n': '\n',
	'\\t': '\t'
};

function deepMergeInner(obj1, obj2) {
	if (obj2 === undefined) {
		return obj1;
	}

	if (!j79.isObject(obj2)) {
		return obj1;
	}

	return deepMerge(obj1, obj2);
}

function hasEvaluateToUndefinedFlag(obj) {
	return ( ( obj || {} ).nexl || {} ).EVALUATE_TO_UNDEFINED === true;
}

function supplyNexlAPI(context, nexlEngine) {
	// supplying nexlize() function
	context.nexl.nexlize = function (nexlExpression, externalArgs4Function) {
		// backing up current context before change
		var contextBackup = context;

		// merging externalArgs4Function to a context
		context = deepMergeInner(context, externalArgs4Function);

		var isEvaluateToUndefined = hasEvaluateToUndefinedFlag(context);

		// running nexl engine
		var result = new nexlEngine(context, isEvaluateToUndefined).processItem(nexlExpression);

		// restoring context
		context = contextBackup;
		return result;
	};

	// supplying set() function
	context.nexl.set = function (key, val) {
		context[key] = val;
	};

	// supplying get() function
	context.nexl.get = function (key, val) {
		return context[key];
	};
}

// when nexl object present in externalArgs, deepMerge() function spoils all stuff under nexl object when merging it to context
function excludeNexlObjectFromExternalArgs(context, externalArgs) {
	// "merging" externalArgs.nexl.EVALUATE_TO_UNDEFINED from externalArgs to context if exists
	if (externalArgs && externalArgs.nexl && externalArgs.nexl.EVALUATE_TO_UNDEFINED === true) {
		context.nexl.EVALUATE_TO_UNDEFINED = true;
	}

	// deleting nexl object from externalArgg
	if (externalArgs) {
		delete externalArgs['nexl'];
	}
}

function makeContext(nexlSource, externalArgs, nexlEngine) {
	// creating context
	var context = nexlSourceUtils.createContext(nexlSource);

	// merging defaultArgs to context
	if (j79.isObject(context.nexl.defaultArgs)) {
		context = deepMergeInner(context, context.nexl.defaultArgs);
	}

	// excluding nexl object from external arguments because of deepMerge() function spoils nexl object after merge
	excludeNexlObjectFromExternalArgs(context, externalArgs);

	// merging external args to context
	if (j79.isObject(externalArgs)) {
		context = deepMergeInner(context, externalArgs);
	}

	// supplying external args
	context.nexl.args = externalArgs;

	supplyStandardLibs(context);

	// giving an access to functions from nexl sources to nexl API
	supplyNexlAPI(context, nexlEngine);

	// assign nexl system functions
	nexlSystemFuncs.assign(context);

	// initializing the context ( nexl.init )
	initContext(context, nexlEngine);

	return context;
}

function initContext(context, nexlEngine) {
	// is nexl.init a string ?
	if (j79.isString(context.nexl.init)) {
		// evaluating nexl.init expression
		new nexlEngine(context).processItem(context.nexl.init);
		return;
	}

	// is nexl.init a function ?
	if (j79.isFunction(context.nexl.init)) {
		// evaluating nexl.init() function
		new nexlEngine(context).processItem('${nexl.init()}');
		return;
	}
}

function supplyStandardLibs(context) {
	context.Number = Number;
	context.Math = Math;
	context.Date = Date;
	context.isFinite = isFinite;
	context.isNaN = isNaN;
	context.parseFloat = parseFloat;
	context.parseInt = parseInt;
}

function replaceSpecialChar(item, char) {
	var lastPos = 0;
	var newStr = item;

	while ((lastPos = newStr.indexOf(char, lastPos)) >= 0) {
		var escaped = j79.escapePrecedingSlashes(newStr, lastPos);
		lastPos = escaped.correctedPos;
		newStr = escaped.escapedStr;

		if (escaped.escaped) {
			lastPos++;
			continue;
		}

		newStr = newStr.substr(0, lastPos) + SPECIAL_CHARS_MAP[char] + newStr.substr(lastPos + 2);
	}

	return newStr;
}


// string representation of \n, \t characters is replaced with their real value
function replaceSpecialChars(item) {
	if (!j79.isString(item)) {
		return item;
	}

	var result = item;

	var specialChars = Object.keys(SPECIAL_CHARS_MAP);
	for (var index in specialChars) {
		result = replaceSpecialChar(result, specialChars[index]);
	}

	return result;
}

function castInner(value, currentType, requiredTypeJs) {
	var result;

	// NUM -> BOOL
	if (currentType === nexlExpressionsParser.JS_PRIMITIVE_TYPES.NUM && requiredTypeJs === nexlExpressionsParser.JS_PRIMITIVE_TYPES.BOOL) {
		result = (value !== 0);
		winston.debug('Casting numeric to boolean, [result=%s]', result);
		return result;
	}

	// NUM -> STR
	if (currentType === nexlExpressionsParser.JS_PRIMITIVE_TYPES.NUM && requiredTypeJs === nexlExpressionsParser.JS_PRIMITIVE_TYPES.STR) {
		result = value + '';
		winston.debug('Casting numeric to boolean, [result=%s]', result);
		return result;
	}

	// BOOL -> NUM
	if (currentType === nexlExpressionsParser.JS_PRIMITIVE_TYPES.BOOL && requiredTypeJs === nexlExpressionsParser.JS_PRIMITIVE_TYPES.NUM) {
		result = value ? 1 : 0;
		winston.debug('Casting boolean to numeric, [result=%s]', result);
		return result;
	}

	// BOOL -> STR
	if (currentType === nexlExpressionsParser.JS_PRIMITIVE_TYPES.BOOL && requiredTypeJs === nexlExpressionsParser.JS_PRIMITIVE_TYPES.STR) {
		result = value + '';
		winston.debug('Casting boolean to string, [result=%s]', result);
		return result;
	}

	// STR -> NUM
	if (currentType === nexlExpressionsParser.JS_PRIMITIVE_TYPES.STR && requiredTypeJs === nexlExpressionsParser.JS_PRIMITIVE_TYPES.NUM) {
		result = parseFloat(value);
		if (isNaN(result)) {
			result = undefined;
		}
		winston.debug('Casting string to numeric, [result=%s]', result);
		return result;
	}

	// STR -> BOOL
	if (currentType === nexlExpressionsParser.JS_PRIMITIVE_TYPES.STR && requiredTypeJs === nexlExpressionsParser.JS_PRIMITIVE_TYPES.BOOL) {
		result = undefined;
		if (value === 'false') {
			result = false;
		}

		if (value === 'true') {
			result = true;
		}

		winston.debug('Casting string to boolean, [result=%s]', result);

		return result;
	}

	winston.debug('Current value of a %s type cannot be casted to %s. Skipping this action...', currentType, requiredTypeJs);

	return value;
}

// example : value = 101; nexlType = 'bool';
function cast(value, type) {
	// if type is not specified
	if (type === undefined) {
		winston.debug('Type is not specified. Skipping typecast...');
		return value;
	}

	// resolving JavaScript type
	var jsType = nexlExpressionsParser.NEXL_TYPES[type];

	// validating ( should not happen )
	if (jsType === undefined) {
		throw util.format('Unknown [%s] type in [%s] expression. Use one of the following types : [%s]', type, this.nexlExpressionMD.str, Object.keys(nexlExpressionsParser.NEXL_TYPES).join(','));
	}

	var currentType = j79.getType(value);

	// if both types are same, return value as is
	if (currentType === jsType) {
		winston.debug('Source and destinations types are same [%s]. Skipping typecast...', jsType);
		return value;
	}

	// cast to null
	if (jsType === nexlExpressionsParser.JS_PRIMITIVE_TYPES.NULL) {
		winston.debug('Destination type is %s. Converting current value to %s', jsType, jsType);
		return null;
	}

	// cast to undefined
	if (jsType === nexlExpressionsParser.JS_PRIMITIVE_TYPES.UNDEFINED) {
		winston.debug('Destination type is %s. Converting current value to %s', jsType, jsType);
		return undefined;
	}

	return castInner(value, currentType, jsType);
}


function convertStrItem2Obj(item, val, obj) {
	var currentRef = obj;
	var currentItem = item;

	var lastDotPos = 0;
	while ((lastDotPos = currentItem.indexOf('.', lastDotPos)) >= 0) {
		var escaped = j79.escapePrecedingSlashes(currentItem, lastDotPos);
		lastDotPos = escaped.correctedPos;
		currentItem = escaped.escapedStr;
		if (escaped.escaped) {
			lastDotPos++;
			continue;
		}

		var key = currentItem.substr(0, lastDotPos);
		currentItem = currentItem.substr(lastDotPos + 1);
		lastDotPos = 0;
		if (currentRef[key] === undefined) {
			currentRef[key] = {};
		}
		currentRef = currentRef[key];
	}

	currentRef[currentItem] = val;
}

function extractTypeAndCast(value) {
	var pos = -1;
	var nexlType;
	for (nexlType in nexlExpressionsParser.NEXL_TYPES) {
		var regex = new RegExp('(' + nexlExpressionsParser.ACTIONS.CAST + nexlType + ')$');
		pos = value.search(regex);
		if (pos >= 0) {
			break;
		}
	}

	// not found ? good bye
	if (pos < 0) {
		return value;
	}

	// is escaped ?
	var escaped = j79.escapePrecedingSlashes(value, pos);
	var newValue = escaped.escapedStr;
	if (escaped.escaped) {
		return newValue;
	}

	newValue = newValue.substr(0, escaped.correctedPos);

	return cast(newValue, nexlType);
}

// example obj =  { 'a.b.c.d': 10 }
// output : { a: {b: {c:{ d: 10}}}}
function convertStrItems2Obj(obj) {
	var result = {};
	for (var key in obj) {
		var val = obj[key];
		val = extractTypeAndCast(val);
		convertStrItem2Obj(key, val, result);
	}

	return result;
}

function produceKeyValuesPairs(rootKey, obj, result) {
	for (var key in obj) {
		var item = obj[key];

		var subKey = rootKey === undefined ? key : rootKey + '.' + key;

		if (j79.isObject(item)) {
			produceKeyValuesPairs(subKey, item, result);
			continue;
		}

		if (j79.isFunction(item)) {
			continue;
		}

		result.push(subKey + '=' + item);
	}
}

function setReadOnlyProperty(obj, key, value) {
	Object.defineProperty(obj, key, {
		enumerable: false,
		configurable: true,
		value: value
	});
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// exports
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.hasEvaluateToUndefinedFlag = hasEvaluateToUndefinedFlag;
module.exports.produceKeyValuesPairs = produceKeyValuesPairs;
module.exports.convertStrItems2Obj = convertStrItems2Obj;
module.exports.cast = cast;
module.exports.deepMergeInner = deepMergeInner;
module.exports.makeContext = makeContext;
module.exports.replaceSpecialChars = replaceSpecialChars;
module.exports.setReadOnlyProperty = setReadOnlyProperty;
