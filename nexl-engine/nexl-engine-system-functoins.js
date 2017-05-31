/**************************************************************************************
 nexl-engine-system-function

 Copyright (c) 2016-2017 Yevgeny Sergeyev
 License : Apache 2.0
 WebSite : http://www.nexl-js.com

 Set of utility functions to enhance nexl expressions functionality
 **************************************************************************************/

const j79 = require('j79-utils');
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


///////////////////////////////////////////////////////////////////////////////////////////
// functions to assign to context
///////////////////////////////////////////////////////////////////////////////////////////

function concatPrimitives(arguments) {
	var result = '';

	for (var index in arguments) {
		var item = arguments[index];

		if (!j79.isPrimitive(item)) {
			return undefined;
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
			return undefined;
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
			return undefined;
		}

		result = deepMerge(result, item);
	}

	return result;
}

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

systemFunctions.setObjVal = function (obj, key, val) {
	if (j79.isObject(obj)) {
		obj[key] = val;
	}

	return obj;
};

systemFunctions.setObjKey = function (obj, currentKey, newKey) {
	if (j79.isObject(obj)) {
		var val = obj[currentKey];
		delete obj[currentKey];
		obj[newKey] = val;
	}

	return obj;
};

systemFunctions.makeObj = function (key, val) {
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
systemFunctions.replaceAll = function (entity, searchItem, replace) {
	if (j79.isArray(entity)) {
		return replaceAll4Array(entity, searchItem, replace);
	}

	if (j79.isString(entity)) {
		return entity.replace(new RegExp(searchItem, 'g'), replace);
	}

	return entity;
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

systemFunctions.isMatch = function (entity, regex, flags) {
	if (!j79.isString(entity)) {
		return entity;
	}

	return new RegExp(regex, flags).test(entity);
};

// is string or array contains value
systemFunctions.isContains = function (entity, item) {
	if (j79.isArray(entity) || j79.isString(entity)) {
		return entity.indexOf(item) >= 0;
	}

	return entity;
};

systemFunctions.isEquals = function (entity1, entity2) {
	return entity1 === entity2;
};

systemFunctions.isEq = function (entity1, entity2) {
	return entity1 === entity2;
};

systemFunctions.isGT = function (entity1, entity2) {
	return entity1 > entity2;
};

systemFunctions.isLT = function (entity1, entity2) {
	return entity1 < entity2;
};

systemFunctions.isGE = function (entity1, entity2) {
	return entity1 >= entity2;
};

systemFunctions.isLE = function (entity1, entity2) {
	return entity1 <= entity2;
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

systemFunctions.ifMatch = function (entity, regex, thenIf, elseIf) {
	if (!j79.isString(entity)) {
		return entity;
	}

	return systemFunctions.isMatch(entity, regex) ? thenIf : elseIf;
};

systemFunctions.ifNMatch = function (entity, regex, thenIf, elseIf) {
	return systemFunctions.ifMatch(entity, regex, elseIf, thenIf);
};

systemFunctions.ifMatchEx = function (entity, regex, flags, thenIf, elseIf) {
	if (!j79.isString(entity)) {
		return entity;
	}

	return systemFunctions.isMatch(entity, regex, flags) ? thenIf : elseIf;
};

systemFunctions.ifNMatchEx = function (entity, regex, flags, thenIf, elseIf) {
	return systemFunctions.ifMatchEx(entity, regex, flags, elseIf, thenIf);
};

systemFunctions.ifContains = function (entity, item, thenIf, elseIf) {
	if (j79.isArray(entity) || j79.isString(entity)) {
		return entity.indexOf(item) >= 0 ? thenIf : elseIf;
	}

	return entity;
};

systemFunctions.ifNContains = function (entity, item, thenIf, elseIf) {
	return systemFunctions.ifContains(entity, item, elseIf, thenIf);
};

systemFunctions.ifEquals = function (entity1, entity2, thenIf, elseIf) {
	return systemFunctions.isEquals(entity1, entity2) ? thenIf : elseIf;
};

systemFunctions.ifNEquals = function (entity1, entity2, thenIf, elseIf) {
	return systemFunctions.ifEquals(entity1, entity2, elseIf, thenIf);
};

systemFunctions.ifEq = function (entity1, entity2, thenIf, elseIf) {
	return systemFunctions.isEquals(entity1, entity2) ? thenIf : elseIf;
};

systemFunctions.ifNEq = function (entity1, entity2, thenIf, elseIf) {
	return systemFunctions.ifEq(entity1, entity2, elseIf, thenIf);
};

systemFunctions.ifGT = function (entity1, entity2, thenIf, elseIf) {
	return entity1 > entity2 ? thenIf : elseIf;
};

systemFunctions.ifLT = function (entity1, entity2, thenIf, elseIf) {
	return entity1 < entity2 ? thenIf : elseIf;
};

systemFunctions.ifGE = function (entity1, entity2, thenIf, elseIf) {
	return entity1 >= entity2 ? thenIf : elseIf;
};

systemFunctions.ifLE = function (entity1, entity2, thenIf, elseIf) {
	return entity1 <= entity2 ? thenIf : elseIf;
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
systemFunctions.inc = function (number, val) {
	if (j79.isNumber(number)) {
		return number + (val ? val : 1);
	}

	return number;
};

systemFunctions.dec = function (number, val) {
	if (j79.isNumber(number)) {
		return number - (val ? val : 1);
	}

	return number;
};

systemFunctions.div = function (number, val) {
	if (j79.isNumber(number) && j79.isNumber(val)) {
		return number / val;
	}

	return number;
};

systemFunctions.mult = function (number, val) {
	if (j79.isNumber(number) && j79.isNumber(val)) {
		return number * val;
	}

	return number;
};

systemFunctions.mod = function (number, val) {
	if (j79.isNumber(number) && j79.isNumber(val)) {
		return number % val;
	}

	return number;
};

///////////////////////////////////////////////////////////////////////////////////////////
// assigning system functions to nexl context
///////////////////////////////////////////////////////////////////////////////////////////
module.exports.assign = function (context) {
	for (var item in systemFunctions) {
		context.nexl.functions.system[item] = systemFunctions[item];
	}
};