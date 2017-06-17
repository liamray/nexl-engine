/**************************************************************************************
 nexl-engine-system-function

 Copyright (c) 2016-2017 Yevgeny Sergeyev
 License : Apache 2.0
 WebSite : http://www.nexl-js.com

 Set of utility functions to enhance nexl expressions functionality
 **************************************************************************************/

const j79 = require('j79-utils');
const util = require('util');
const deepMerge = require('deepmerge');

var systemFunctions = {};

///////////////////////////////////////////////////////////////////////////////////////////
// helper functions
///////////////////////////////////////////////////////////////////////////////////////////

// replace all in array or string
function replaceAll4Array(entity, searchItem, replace) {
	for (var index = 0; index < entity.length; index++) {
		if (entity[index] === searchItem) {
			entity[index] = replace;
		}
	}

	return entity;
}

function concatPrimitives(arguments) {
	var result = '';

	for (var index in arguments) {
		var item = arguments[index];

		if (!j79.isPrimitive(item)) {
			j79.winston.debug('Skipping non-primitive value in concat() function');
			continue;
		}

		result += item;
	}

	return result;
}

function concatArrays(arguments) {
	var result = [];

	for (var index in arguments) {
		var item = arguments[index];

		if (!j79.isArray(item)) {
			j79.winston.debug('Skipping non-array value in concat() function');
			continue;
		}

		result = result.concat(item);
	}

	return result;
}

function concatObjects(arguments) {
	var result = {};

	for (var index in arguments) {
		var item = arguments[index];

		if (!j79.isObject(item)) {
			j79.winston.debug('Skipping non-object value in concat() function');
			continue;
		}

		result = deepMerge(result, item);
	}

	return result;
}


///////////////////////////////////////////////////////////////////////////////////////////
// functions to assign to context
///////////////////////////////////////////////////////////////////////////////////////////
systemFunctions.keyVals = function (obj, key) {
	if (!j79.isObject(obj)) {
		j79.winston.debug('The keyVal() function is not applicable because first parameter is not an object. Skipping...');
		return obj;
	}

	// validating key. it must be either primitive or array
	if (!j79.isPrimitive(key) && !j79.isArray(key)) {
		j79.winston.debug('The keyVal() function is not applicable because second parameter must be a primitive or array, but got a parameters of [%s] type', j79.getType(key));
		return undefined;
	}

	var result = {};
	var keys = j79.wrapWithArrayIfNeeded(key);

	// iteration over keys
	for (var index in keys) {
		key = keys[index];
		if (j79.isPrimitive(key)) {
			result[key] = obj[key];
		}
	}

	return result;
};

systemFunctions.updAt = function (arrOrStr, val, index) {
	if (!j79.isArray(arrOrStr)) {
		return arrOrStr;
	}

	index = parseInt(index);

	if (index === index && index >= 0) {
		arrOrStr[index] = val;
	}

	return arrOrStr;
};

systemFunctions.insAt = function (arrOrStr, val, index) {
	if (!j79.isArray(arrOrStr)) {
		return arrOrStr;
	}

	index = parseInt(index);

	if (index === index && index >= 0) {
		arrOrStr.splice(index, 0, val);
	}

	return arrOrStr;
};

systemFunctions.delAt = function (arrOrStr, index, cnt) {
	if (!j79.isArray(arrOrStr)) {
		return arrOrStr;
	}

	index = parseInt(index);
	cnt = parseInt(cnt);

	if (index !== index || index < 0) {
		return arrOrStr;
	}

	if (cnt !== cnt || cnt < 0) {
		cnt = 1;
	}

	arrOrStr.splice(index, cnt);

	return arrOrStr;
};

// resolves key set from "obj" at "level" level
systemFunctions.keys = function (obj, level) {
	if (!j79.isObject(obj)) {
		return obj;
	}

	level = (level === undefined) ? 0 : parseInt(level);

	if (level === 0 || level !== level) {
		return Object.keys(obj);
	}

	var result = [];
	for (var key in obj) {
		var val = obj[key];
		if (j79.isObject(val)) {
			var tmp = systemFunctions.keys(val, level - 1);
			result = result.concat(tmp);
		}
	}

	return result;
};

// resolves values from "obj" at "level" level
systemFunctions.vals = function (obj, level) {
	if (!j79.isObject(obj)) {
		return obj;
	}

	level = (level === undefined) ? 0 : parseInt(level);

	if (level === 0 || level !== level) {
		return j79.getObjectValues(obj);
	}

	var result = [];
	for (var key in obj) {
		var val = obj[key];
		if (j79.isObject(val)) {
			var tmp = systemFunctions.vals(val, level - 1);
			result = result.concat(tmp);
		}
	}

	return result;
};

// makes obj from arguments
systemFunctions.obj = function () {
	var result = {};
	for (var index = 0; index < arguments.length / 2; index++) {
		var key = arguments[index * 2];
		if (!j79.isPrimitive(key)) {
			throw util.format('Object key must be a primitive type at [%s] position', index * 2);
		}
		var val = arguments[index * 2 + 1];
		result[key] = val;
	}
	return result;
};

// makes array from arguments
systemFunctions.arr = function () {
	var result = [];
	for (var index in arguments) {
		result.push(arguments[index]);
	}
	return result;
};

systemFunctions.concat = function () {
	if (arguments.length < 1) {
		return;
	}

	var firstArgType = j79.getType(arguments[0]);
	if (j79.isPrimitiveType(firstArgType)) {
		firstArgType = j79.TYPE_STRING;
	}

	switch (firstArgType) {
		case j79.TYPE_STRING: {
			return concatPrimitives(arguments);
		}

		case j79.TYPE_ARRAY: {
			return concatArrays(arguments);
		}

		case j79.TYPE_OBJECT: {
			return concatObjects(arguments);
		}
	}

	return undefined;
};

systemFunctions.setKey = function (obj, currentKey, newKey) {
	if (j79.isObject(obj)) {
		var val = obj[currentKey];
		delete obj[currentKey];
		obj[newKey] = val;
	}

	return obj;
};

systemFunctions.setVal = function (obj, key, val) {
	if (j79.isObject(obj)) {
		obj[key] = val;
	}

	return obj;
};

systemFunctions.makeObj = function (key, val) { // <---- DEPRECATED ! Use obj() function instead
	var result = {};

	if (j79.isPrimitive(key)) {
		result[key] = val;
	}

	if (j79.isArray(key)) {
		for (var index in key) {
			result[key[index]] = val;
		}
	}

	return result;
};

// replaces items in array or string
systemFunctions.replaceAll = function (arrOrStr, searchItem, replace) {
	if (j79.isArray(arrOrStr)) {
		return replaceAll4Array(arrOrStr, searchItem, replace);
	}

	if (j79.isString(arrOrStr)) {
		return arrOrStr.replace(new RegExp(searchItem, 'g'), replace);
	}

	return arrOrStr;
};

systemFunctions.not = function (param) {
	if (j79.isBool(param)) {
		return !param;
	} else {
		return param;
	}
};

///////////////////////////////////////////////////////////////////////////////
// is*

systemFunctions.isMatch = function (str, regex, flags) {
	if (!j79.isString(str)) {
		return str;
	}

	return new RegExp(regex, flags).test(str);
};

// is string or array contains value
systemFunctions.isContains = function (arrOrStr, item) {
	if (j79.isArray(arrOrStr) || j79.isString(arrOrStr)) {
		return arrOrStr.indexOf(item) >= 0;
	}

	return arrOrStr;
};

systemFunctions.isEquals = function (item1, item2) {
	return item1 === item2;
};

systemFunctions.isEq = function (item1, item2) {
	return item1 === item2;
};

systemFunctions.isGT = function (item1, item2) {
	return item1 > item2;
};

systemFunctions.isLT = function (item1, item2) {
	return item1 < item2;
};

systemFunctions.isGE = function (item1, item2) {
	return item1 >= item2;
};

systemFunctions.isLE = function (item1, item2) {
	return item1 <= item2;
};

systemFunctions.isBool = function (item) {
	return j79.isBool(item);
};

systemFunctions.isStr = function (item) {
	return j79.isString(item);
};

systemFunctions.isNum = function (item) {
	return j79.isNumber(item);
};

systemFunctions.isNull = function (item) {
	return item === null;
};

systemFunctions.isUndefined = function (item) {
	return item === undefined;
};

systemFunctions.isNaN = function (item) {
	return item !== item;
};

systemFunctions.isPrimitive = function (item) {
	return j79.isPrimitive(item);
};

systemFunctions.isArray = function (item) {
	return j79.isArray(item);
};

systemFunctions.isObject = function (item) {
	return j79.isObject(item);
};

///////////////////////////////////////////////////////////////////////////////
// if*

systemFunctions.ifMatch = function (str, regex, thenIf, elseIf) {
	if (!j79.isString(str)) {
		return str;
	}

	return systemFunctions.isMatch(str, regex) ? thenIf : elseIf;
};

systemFunctions.ifNMatch = function (str, regex, thenIf, elseIf) {
	return systemFunctions.ifMatch(str, regex, elseIf, thenIf);
};

systemFunctions.ifMatchEx = function (str, regex, flags, thenIf, elseIf) {
	if (!j79.isString(str)) {
		return str;
	}

	return systemFunctions.isMatch(str, regex, flags) ? thenIf : elseIf;
};

systemFunctions.ifNMatchEx = function (str, regex, flags, thenIf, elseIf) {
	return systemFunctions.ifMatchEx(str, regex, flags, elseIf, thenIf);
};

systemFunctions.ifContains = function (arrOrStr, item, thenIf, elseIf) {
	if (j79.isArray(arrOrStr) || j79.isString(arrOrStr)) {
		return arrOrStr.indexOf(item) >= 0 ? thenIf : elseIf;
	}

	return arrOrStr;
};

systemFunctions.ifNContains = function (arrOrStr, item, thenIf, elseIf) {
	return systemFunctions.ifContains(arrOrStr, item, elseIf, thenIf);
};

systemFunctions.ifEquals = function (item1, item2, thenIf, elseIf) {
	return systemFunctions.isEquals(item1, item2) ? thenIf : elseIf;
};

systemFunctions.ifNEquals = function (item1, item2, thenIf, elseIf) {
	return systemFunctions.ifEquals(item1, item2, elseIf, thenIf);
};

systemFunctions.ifEq = function (item1, item2, thenIf, elseIf) {
	return systemFunctions.isEquals(item1, item2) ? thenIf : elseIf;
};

systemFunctions.ifNEq = function (item1, item2, thenIf, elseIf) {
	return systemFunctions.ifEq(item1, item2, elseIf, thenIf);
};

systemFunctions.ifGT = function (item1, item2, thenIf, elseIf) {
	return item1 > item2 ? thenIf : elseIf;
};

systemFunctions.ifLT = function (item1, item2, thenIf, elseIf) {
	return item1 < item2 ? thenIf : elseIf;
};

systemFunctions.ifGE = function (item1, item2, thenIf, elseIf) {
	return item1 >= item2 ? thenIf : elseIf;
};

systemFunctions.ifLE = function (item1, item2, thenIf, elseIf) {
	return item1 <= item2 ? thenIf : elseIf;
};

systemFunctions.ifBool = function (item, thenIf, elseIf) {
	return systemFunctions.isBool(item) ? thenIf : elseIf;
};

systemFunctions.ifNBool = function (item, thenIf, elseIf) {
	return systemFunctions.ifBool(item, elseIf, thenIf);
};

systemFunctions.ifStr = function (item, thenIf, elseIf) {
	return systemFunctions.isStr(item) ? thenIf : elseIf;
};

systemFunctions.ifNStr = function (item, thenIf, elseIf) {
	return systemFunctions.ifStr(item, elseIf, thenIf);
};

systemFunctions.ifNum = function (item, thenIf, elseIf) {
	return systemFunctions.isNum(item) ? thenIf : elseIf;
};

systemFunctions.ifNNum = function (item, thenIf, elseIf) {
	return systemFunctions.ifNum(item, elseIf, thenIf);
};

systemFunctions.ifNull = function (item, thenIf, elseIf) {
	return systemFunctions.isNull(item) ? thenIf : elseIf;
};

systemFunctions.ifNNull = function (item, thenIf, elseIf) {
	return systemFunctions.ifNull(item, elseIf, thenIf);
};

systemFunctions.ifUndefined = function (item, thenIf, elseIf) {
	return systemFunctions.isUndefined(item) ? thenIf : elseIf;
};

systemFunctions.ifNUndefined = function (item, thenIf, elseIf) {
	return systemFunctions.ifUndefined(item, elseIf, thenIf);
};

systemFunctions.ifNaN = function (item, thenIf, elseIf) {
	return systemFunctions.isNaN(item) ? thenIf : elseIf;
};

systemFunctions.ifNNaN = function (item, thenIf, elseIf) {
	return systemFunctions.ifNaN(item, elseIf, thenIf);
};

systemFunctions.ifPrimitive = function (item, thenIf, elseIf) {
	return systemFunctions.isPrimitive(item) ? thenIf : elseIf;
};

systemFunctions.ifNPrimitive = function (item, thenIf, elseIf) {
	return systemFunctions.ifPrimitive(item, elseIf, thenIf);
};

systemFunctions.ifArray = function (item, thenIf, elseIf) {
	return systemFunctions.isArray(item) ? thenIf : elseIf;
};

systemFunctions.ifNArray = function (item, thenIf, elseIf) {
	return systemFunctions.ifArray(item, elseIf, thenIf);
};

systemFunctions.ifObject = function (item, thenIf, elseIf) {
	return systemFunctions.isObject(item) ? thenIf : elseIf;
};

systemFunctions.ifNObject = function (item, thenIf, elseIf) {
	return systemFunctions.ifObject(item, elseIf, thenIf);
};

///////////////////////////////////////////////////////////////////////////////
// math funcs

// accepts multiple arguments
systemFunctions.inc = function (number) {
	if (!j79.isNumber(number)) {
		return number;
	}

	if (arguments.length < 2) {
		return number + 1;
	}

	var result = number;
	for (var index = 1; index < arguments.length; index++) {
		result += arguments[index];
	}

	return result;
};

systemFunctions.dec = function (number) {
	if (!j79.isNumber(number)) {
		return number;
	}

	if (arguments.length < 2) {
		return number - 1;
	}

	var result = number;
	for (var index = 1; index < arguments.length; index++) {
		result -= arguments[index];
	}

	return result;
};

systemFunctions.div = function (number) {
	if (!j79.isNumber(number)) {
		return number;
	}

	var result = number;
	for (var index = 1; index < arguments.length; index++) {
		result /= arguments[index];
	}

	return result;
};

systemFunctions.mult = function (number) {
	if (!j79.isNumber(number)) {
		return number;
	}

	var result = number;
	for (var index = 1; index < arguments.length; index++) {
		result *= arguments[index];
	}

	return result;
};

systemFunctions.mod = function (number) {
	if (!j79.isNumber(number)) {
		return number;
	}

	var result = number;
	for (var index = 1; index < arguments.length; index++) {
		result %= arguments[index];
	}

	return result;
};

///////////////////////////////////////////////////////////////////////////////////////////
// assigning system functions to nexl context
///////////////////////////////////////////////////////////////////////////////////////////
module.exports.assign = function (context) {
	for (var item in systemFunctions) {
		context.nexl.funcs.sys[item] = systemFunctions[item];
	}
};

module.exports.nexlSystemFuncs = systemFunctions;