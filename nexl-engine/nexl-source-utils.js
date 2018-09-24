/**************************************************************************************
 nexl-source-utils

 Copyright (c) 2016-2017 Liam Ray
 License : Apache 2.0
 WebSite : http://www.nexl-js.com

 Set of utility functions for nexl-source
 **************************************************************************************/

const esprima = require('esprima');
const path = require('path');
const util = require('util');
const fs = require('fs');
const j79 = require('j79-utils');
var logger = require('./logger').logger();


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function buildErrMsg(ancestor, msg) {
	var args = Array.prototype.slice.call(arguments);
	args.shift();

	if (ancestor) {
		args[0] += '. Requested from [%s] file';
		args.push(ancestor);
	}

	return util.format.apply(util, args);
}

function buildShortErrMsg(ancestor, msg) {
	var args = Array.prototype.slice.call(arguments);
	args[0] = ancestor ? path.basename(ancestor) : ancestor;
	return buildErrMsg.apply(null, args);
}

function resolveIncludeDirectiveDom(item) {
	if (!item.expression || item.expression["type"] != "Literal") {
		return null;
	}

	var itemValue = item.expression.raw;

	if (!itemValue) {
		return null;
	}

	// regex tells : starts from quote OR single quote, @ character, one OR unlimited amount of any character, ends with the same quote which it was started
	var itemContent = itemValue.match(/^('|")@\s(.+)(\1)$/);
	if (itemContent && itemContent.length === 4) {
		return {
			path: itemContent[2],
			raw: itemValue
		};
	} else {
		return null;
	}
}

// parses javascript provided as text and resolves nexl include directives ( like "@import ../../src.js"; )
function resolveIncludeDirectives(text, fileName) {
	var result = [];

	// parse source code with esprima
	try {
		var srcParsed = esprima.parse(text);
	} catch (e) {
		logger.error(buildErrMsg(fileName, 'Failed to parse JavaScript source code. Reason [%s]', e));
		throw buildShortErrMsg(fileName, 'Failed to parse JavaScript source code. Reason [%s]', e)
	}

	// iterating over and looking for include directives
	for (var key in srcParsed.body) {
		var item = srcParsed.body[key];

		// resolve include directive from dom item
		var includeDirective = resolveIncludeDirectiveDom(item);
		if (includeDirective != null) {
			result.push(includeDirective);
		}
	}

	return result;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

NexlSourceCodeAssembler.prototype.assembleSourceCodeAsText = function () {
	// the text
	var text = this.nexlSource.asText.text;

	// validating
	if (!j79.isString(text)) {
		throw util.format('[nexlSource.asText.text] must be of string type, but you provided it as [%s] type', j79.getType(text));
	}

	// resolving include directives
	var includeDirectives = resolveIncludeDirectives(text);

	var includedText;

	// substituting include directives
	for (var index in includeDirectives) {
		var includeDirective = includeDirectives[index];

		// does directive have an absolute path ?
		if (path.isAbsolute(includeDirective.path)) {
			includedText = this.assembleSourceCodeAsFile(includeDirective.path);
			text = text.replace(includeDirective.raw, includedText);
			continue;
		}

		// directive has a relative path. is basePath provided ?
		if (!this.nexlSource.basePath) {
			logger.error('Source code contains reference to the [%s] file for import, but you didn\'t provide a [nexlSource.basePath]', path.basename(includeDirective.path));
			throw util.format('Source code contains reference to the [%s] file for import, but you didn\'t provide a [nexlSource.basePath]', includeDirective.path);
		}

		var fullPath = path.join(this.nexlSource.basePath, includeDirective.path);
		includedText = this.assembleSourceCodeAsFile(fullPath);
		text = text.replace(includeDirective.raw, includedText);
	}

	return text;
};

NexlSourceCodeAssembler.prototype.validateBasePath = function (fileName, ancestor) {
	// nothing to validate if basePath not provided
	if (!this.nexlSource.basePath) {
		return;
	}

	if (!path.isAbsolute(fileName)) {
		logger.error(buildErrMsg(ancestor, "must be a full path"));
		throw buildShortErrMsg(ancestor, "must be a full path")
	}

	var fileNameNormalized = path.normalize(fileName);
	var filePath = path.dirname(fileNameNormalized);
	var basePath = path.normalize(this.nexlSource.basePath);

	// filePath must be a part of basePath
	if (filePath.indexOf(basePath) !== 0) {
		logger.error(buildErrMsg(ancestor, "out of the basePath"));
		throw buildShortErrMsg(ancestor, "out of the basePath")
	}

	logger.debug('The [%s] file is located under the [%s] base path', fileName, this.nexlSource.basePath);
};

NexlSourceCodeAssembler.prototype.assembleSourceCodeAsFile = function (fileName, ancestor) {
	if (j79.isLogLevel('debug')) {
		logger.debug(buildErrMsg(ancestor, 'Including [%s] file', fileName));
	}

	var fileName4Registry = j79.fixPathSlashes(fileName);

	// is already included ?
	if (this.filesRegistry.indexOf(fileName4Registry) >= 0) {
		logger.debug('The [%s] is already included. Skipping...', fileName);
		return '';
	}

	// is file name specified ?
	if (!j79.isValSet(fileName)) {
		logger.error(buildErrMsg(ancestor, "fileName is not provided in nexl source"));
		throw buildShortErrMsg(ancestor, "fileName is not provided in nexl source")
	}

	// validating basePath
	this.validateBasePath(fileName, ancestor);

	// adding to registry
	this.filesRegistry.push(j79.fixPathSlashes(fileName4Registry));

	// is file exists ?
	if (!fs.existsSync(fileName)) {
		logger.error(buildErrMsg(ancestor, "The [%s] nexl source file doesn't exist", fileName));
		throw buildShortErrMsg(ancestor, "The [%s] nexl source file doesn't exist", path.basename(fileName))
	}

	// is it file and not a directory or something else ?
	if (!fs.lstatSync(fileName).isFile()) {
		logger.error(buildErrMsg(ancestor, "The [%s] source is not a file", fileName));
		throw buildShortErrMsg(ancestor, "The [%s] source is not a file", fileName);
	}

	// reading file content
	var text;
	try {
		text = fs.readFileSync(fileName, "UTF-8");
	} catch (e) {
		logger.error(buildErrMsg(ancestor, "Failed to read [%s] file content. Reason is [%s]", fileName, e));
		throw buildShortErrMsg(ancestor, "Failed to read [%s] file content. Reason is [%s]", path.basename(fileName), e);
	}

	// resolving include directives
	var includeDirectives = resolveIncludeDirectives(text, fileName);

	var includedText;

	// substituting include directives
	for (var index in includeDirectives) {
		var includeDirective = includeDirectives[index];

		// does directive have an absolute path ?
		if (path.isAbsolute(includeDirective.path)) {
			includedText = this.assembleSourceCodeAsFile(includeDirective.path, fileName);
			text = text.replace(includeDirective.raw, includedText);
			continue;
		}

		// resolve file path
		var filePath = path.dirname(fileName);

		var fullPath = path.join(filePath, includeDirective.path);
		includedText = this.assembleSourceCodeAsFile(fullPath, fileName);
		text = text.replace(includeDirective.raw, includedText);
	}

	return text;
};

NexlSourceCodeAssembler.prototype.assemble = function () {
	logger.debug('Assembling', this.nexlSource, 'nexl source');

	this.filesRegistry = [];

	// validating nexlSource
	if (this.nexlSource === 'undefined') {
		throw "nexl source is not provided";
	}

	// is both provided ?
	if (this.nexlSource.asText && this.nexlSource.asFile) {
		throw "You have to provide asText or asFile, but not both at a same time";
	}

	// is nexl source code provided as text ?
	if (j79.isObject(this.nexlSource.asText)) {
		return this.assembleSourceCodeAsText();
	}

	// is nexl source code provided as file ?
	if (j79.isObject(this.nexlSource.asFile)) {
		return this.assembleSourceCodeAsFile(this.nexlSource.asFile.fileName);
	}

	throw "nexlSource doesn\'t contain either [asText] or [asFile] parameters";
};

function NexlSourceCodeAssembler(nexlSource) {
	this.nexlSource = nexlSource;
}

function assembleSourceCode(nexlSource) {
	return new NexlSourceCodeAssembler(nexlSource).assemble();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function parseAndPushVariableItem(varDeclaration, result) {
	for (var i = 0; i < varDeclaration.declarations.length; i++) {
		var item = varDeclaration.declarations[i];
		var variableInfo = {};

		variableInfo.name = item.id.name;
		if (item.init !== null) {
			variableInfo.type = item.init.type;
		}

		result.push(variableInfo);
	}
}

function parseAndPushExpressionItem(item, result) {
	if (item.expression.left === undefined || item.expression.left.name === undefined) {
		return;
	}

	var variableInfo = {
		type: item.expression.right.type,
		name: item.expression.left.name
	};

	result.push(variableInfo);
}

function parseAndPushFunctionItem(item, result) {
	var variableInfo = {
		type: item.type,
		name: item.id.name,
		params: []
	};

	for (var param in item.params) {
		variableInfo.params.push(item.params[param].name);
	}

	result.push(variableInfo);
}

function parseAndPushSourceCodeItem(item, result) {
	switch (item.type) {
		case 'VariableDeclaration': {
			parseAndPushVariableItem(item, result);
			return;
		}

		case 'ExpressionStatement' : {
			parseAndPushExpressionItem(item, result);
			return;
		}

		case 'FunctionDeclaration' : {
			parseAndPushFunctionItem(item, result);
			return;
		}
	}
}

function resolveJsVariables(nexlSource) {
	var sourceCode = assembleSourceCode(nexlSource);

	try {
		var parsedCode = esprima.parse(sourceCode).body;
	} catch (e) {
		logger.error('Failed to parse JavaScript file. Reason : %s. nexlSource is [%s]', e, JSON.stringify(nexlSource));
		var errMsg = util.format('Failed to parse JavaScript file. Reason : %s', e);
		if (nexlSource.asFile.fileName) {
			errMsg = util.format('%s. file name is [%s]', errMsg, path.basename(nexlSource.asFile.fileName1));
		}
		throw errMsg;
	}

	var result = [];

	logger.debug('Resolving JavaScript variables for [%s] nexl source', nexlSource);

	for (var i = 0; i < parsedCode.length; i++) {
		var item = parsedCode[i];
		parseAndPushSourceCodeItem(item, result);
	}

	return result;
}

function reloadLoggerInstance() {
	logger = require('./logger').logger();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// exports
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.assembleSourceCode = assembleSourceCode;
module.exports.resolveJsVariables = resolveJsVariables;
module.exports.reloadLoggerInstance = reloadLoggerInstance;
