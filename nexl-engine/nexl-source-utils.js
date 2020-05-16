/**************************************************************************************
 nexl-source-utils

 Copyright (c) 2016-2020 Liam Ray
 License : Apache 2.0
 WebSite : http://www.nexl-js.com

 Set of utility functions for nexl-source
 **************************************************************************************/

const acorn = require('acorn');
const path = require('path');
const util = require('util');
const fs = require('fs');
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

// parses JavaScript provided as text and resolves nexl include directives ( like "@import ../../src.js"; )
function resolveIncludeDirectives(text, fileItem) {
	var result = [];

	// parsing source code with acorn
	try {
		var srcParsed = acorn.parse(text);
	} catch (e) {
		logger.error(buildErrMsg(fileItem.ancestor, 'Failed to parse a [%s] JavaScript file. Reason : [%s]', fileItem.filePath, e));
		throw buildShortErrMsg(fileItem.ancestor, 'Failed to parse a [%s] JavaScript file. Reason : [%s]', path.basename(fileItem.filePath), e)
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

NexlSourceCodeAssembler.prototype.validateBasePath = function (fileItem) {
	// is base path provided ?
	if (!this.basePath) {
		return;
	}

	// is filePath provided ?
	if (!fileItem.filePath) {
		return;
	}

	var justPath = path.dirname(fileItem.filePath);

	// filePath must be a part of basePath
	if (justPath.indexOf(this.basePath) !== 0) {
		logger.error(buildErrMsg(fileItem.ancestor, util.format('The [%s] file is located out of [%s] base path and cannot be included', fileItem.filePath, this.basePath)));
		throw buildShortErrMsg(fileItem.ancestor, 'The [%s] file you are trying to include is located out the base path and cannot be included', path.basename(fileItem.filePath));
	}

	logger.debug('Base path is [%s], file path is [%s]. File is under the base path', fileItem.filePath, this.basePath);
};

NexlSourceCodeAssembler.prototype.resolveFileContent = function (fileItem) {
	// is file content provided ?
	if (fileItem.fileContent) {
		return fileItem.fileContent;
	}

	// is filePath provided ?
	if (!fileItem.filePath) {
		logger.error(buildErrMsg(fileItem.ancestor, util.format('[fileContent] or [filePath] is not provided in nexl source. Nothing to assemble')));
		throw buildShortErrMsg(fileItem.ancestor, '[fileContent] or [filePath] is not provided in nexl source');
	}

	// is already included ?
	if (this.filesRegistry.indexOf(fileItem.filePath) >= 0) {
		logger.warn('The [%s] file is already included. Skipping...', fileItem.filePath);
		return '';
	}

	// adding to registry
	this.filesRegistry.push(fileItem.filePath);

	// is file exists ?
	if (!fs.existsSync(fileItem.filePath)) {
		logger.error(buildErrMsg(fileItem.ancestor, `The [${fileItem.filePath}] file doesn't exist and cannot be included`));
		throw buildShortErrMsg(fileItem.ancestor, `The [${path.basename(fileItem.filePath)}] file doesn't exist and cannot be included`);
	}

	// reading file content from file
	try {
		return fs.readFileSync(fileItem.filePath, fileItem.fileEncoding || "UTF-8");
	} catch (e) {
		logger.error(buildErrMsg(fileItem.ancestor, "Failed to read the [%s] file. Reason: [%s]", fileItem.filePath, e));
		throw buildShortErrMsg(fileItem.ancestor, "Failed to read the [%s] file", path.basename(fileItem.filePath));
	}

};

NexlSourceCodeAssembler.prototype.resolveIncludeDirectiveFullPath = function (includeDirective, fileItem) {
	if (path.isAbsolute(includeDirective.path)) {
		return path.normalize(includeDirective.path);
	}

	// the path is relative; is fileItem.filePath provided ? we need it to calc full path of include directive relatively to filePath
	if (!fileItem.filePath) {
		logger.error(buildErrMsg(fileItem.ancestor, '[fileContent] contains include directives with relative path, but [filePath] is not provided to calculate the absolute path'));
		throw buildShortErrMsg(fileItem.ancestor, '[fileContent] contains include directives with relative path, but [filePath] is not provided to calculate the absolute path');
	}

	var justFilePath = path.dirname(fileItem.filePath);
	return path.join(justFilePath, includeDirective.path);
};

NexlSourceCodeAssembler.prototype.assembleInner = function (fileItem) {
	// validating path constrain
	this.validateBasePath(fileItem);

	var text = this.resolveFileContent(fileItem);

	// resolving include directives
	var includeDirectives = resolveIncludeDirectives(text, fileItem);

	var includedText;

	// substituting include directives
	for (var index in includeDirectives) {
		var includeDirective = includeDirectives[index];

		// resolve file path
		includedText = this.assembleInner({
			filePath: this.resolveIncludeDirectiveFullPath(includeDirective, fileItem),
			ancestor: fileItem.filePath
		});

		// replacing
		text = text.replace(includeDirective.raw, includedText);
	}

	return text;
};

NexlSourceCodeAssembler.prototype.assemble = function () {
	logger.debug('Assembling nexl source');

	this.filesRegistry = [];

	// resolving abs path for basePath if provided
	if (this.nexlSource.basePath) {
		this.basePath = path.resolve(this.nexlSource.basePath);
	}

	return this.assembleInner({
		filePath: this.nexlSource.filePath ? path.resolve(this.nexlSource.filePath) : this.nexlSource.filePath,
		fileContent: this.nexlSource.fileContent
	});
};

function NexlSourceCodeAssembler(nexlSource) {
	this.nexlSource = nexlSource;
}

function assembleSourceCode(nexlSource) {
	return new NexlSourceCodeAssembler(nexlSource).assemble();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function reloadLoggerInstance() {
	logger = require('./logger').logger();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getVarDeclaration(item, varName) {
	if (item.type === 'ExpressionStatement') {
		return (item.expression && item.expression.left && item.expression.left.name === varName) ? {
			start: item.expression.start,
			end: item.expression.end
		} : undefined;
	}

	if (item.type === 'VariableDeclaration') {
		// iterating over declarations
		let itemCandidate;
		item.declarations.forEach(declaration => {
			if (declaration.id && declaration.id.name === varName) {
				itemCandidate = {start: declaration.start, end: declaration.end};
			}
		});
		return itemCandidate;
	}

}

function replaceAt(string, start, end, replace) {
	return string.substring(0, start) + replace + string.substring(end + 1);
}

// params are: filePath, fileEncoding, varName, varValue
function updateParticularVariable(params) {
	// loading a file
	let fileContent;
	try {
		fileContent = fs.readFileSync(params.filePath, params.fileEncoding || "UTF-8");
	} catch (e) {
		// todo: format the (e) before throwing
		throw `Failed to load file content. [filePath=${params.filePath}]. Reason: [${e}]`;
	}

	// parsing js file content
	let parsed;
	try {
		parsed = acorn.parse(fileContent);
	} catch (e) {
		// todo: format the (e) before throwing
		throw `Failed to parse a JavaScript [filePath=${params.filePath}]. Reason: [${e}]`;
	}

	// searching for occurrences. if there are few vars with the same name, using the last one
	let varDef;
	parsed.body.forEach(item => {
		let varDefCandidate = getVarDeclaration(item, params.varName);
		varDef = (varDefCandidate === undefined) ? varDef : varDefCandidate;
	});

	//
	const varValue = JSON.stringify(params.varValue, null, 2);
	const replacement = `${params.varName} = ${varValue}`;
	if (varDef) {
		// replacing existing var def
		fileContent = replaceAt(fileContent, varDef.start, varDef.end - 1, replacement);
	} else {
		// adding var declaration to the end
		fileContent += '\n' + replacement;
	}

	try {
		fs.writeFileSync(params.filePath, fileContent, {encoding: params.fileEncoding || "UTF-8"});
	} catch (e) {
		// todo: format the (e) before throwing
		throw `Failed to write file content. [filePath=${params.filePath}]. Reason: [${e}]`;
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// exports
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.assembleSourceCode = assembleSourceCode;
module.exports.reloadLoggerInstance = reloadLoggerInstance;
module.exports.updateParticularVariable = updateParticularVariable;
