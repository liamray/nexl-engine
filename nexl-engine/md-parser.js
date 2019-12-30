// todo: supply dummy function params
// todo: test with nexl-engine test sources
// todo: make tests for each source separately ( the real test )

/*
Expressions builder ( navigation bar )
- all expressions without operations
- default value @
- object operations ~ including eliminate operation
- array operations including join, including adding and elimination, including slicing
- string operations
- mandatory operation
 */


const esprima = require('esprima');
const fs = require('fs');
const j79 = require('j79-utils');

let fileContent;
fileContent = fs.readFileSync('C:\\WORKSPACES\\applications\\javascript\\db-express\\source.js') + '';
fileContent = fs.readFileSync('C:\\TEMP\\all.txt') + '';


function resolveObjProps(item) {
    const result = [];
    item.properties.forEach(prop => {
        result.push(prop.key.name || prop.key.value);
    });
    return result;
}

function resolveObjectPropName(item) {
    if (item.property) {
        const prefix = resolveObjectPropName(item.object);
        const name = item.property.name;
        return (prefix && name) ? resolveObjectPropName(item.object) + '.' + name : undefined;
    }

    return item.name;
}

function resolveName(item) {
    if (item.name) {
        return item.name;
    }

    if (!item.property || !item.object) {
        return;
    }

    const name = resolveObjectPropName(item);

    // omitting nexl object
    return !name || name.indexOf('nexl.') === 0 ? undefined : name;
}

function pushMDItem(md, item) {
    if (item.name) {
        md.push(item);
    }
}

function parseMD(source) {
    const result = [];

    const parsed = esprima.parse(source);
    parsed.body.forEach(item => {
        // is function declaration ?
        if (item.type === 'FunctionDeclaration') {
            pushMDItem(result, {
                name: item.id.name,
                type: 'Function'
            });
        }

        // is assignment expression ?
        if (item.type !== 'ExpressionStatement' || item.expression.type !== 'AssignmentExpression') {
            return;
        }

        // has any data ?
        if (!item.expression || !item.expression.left || !item.expression.right) {
            return;
        }

        // object
        if (item.expression.right.type === 'ObjectExpression') {
            pushMDItem(result, {
                name: resolveName(item.expression.left),
                keys: resolveObjProps(item.expression.right),
                type: 'Object'
            });
            return;
        }

        // array
        if (item.expression.right.type === 'ArrayExpression') {
            pushMDItem(result, {
                name: resolveName(item.expression.left),
                type: 'Array'
            });
            return;
        }

        // function
        if (item.expression.right.type === 'FunctionExpression' || item.expression.right.type === 'ArrowFunctionExpression') {
            pushMDItem(result, {
                name: resolveName(item.expression.left),
                type: 'Function'
            });
            return;
        }

        const element = {
            name: resolveName(item.expression.left),
            type: ({}).toString.call(item.expression.right.value).match(/\s([a-zA-Z]+)/)[1]
        };

        if (element.name === undefined) {
            return;
        }

        if (element.type === 'Undefined' || element.type === 'Null') {
            delete element.type;
        }

        pushMDItem(result, element);

    });

    return result;
}

function escapeKey(key) {
    return key.replace(/-/g, '\\-');
}

function md2Expressions(md) {
    const result = [];
    md.forEach(item => {
        if (item.type === 'Function') {
            result.push(`\${${item.name}()}`);
            return;
        }

        result.push(`\${${item.name}}`);

        if (item.type === 'Object' && item.keys) {
            item.keys.forEach(key => {
                const keyEscaped = escapeKey(key);
                result.push(`\${${item.name}.${keyEscaped}}`);
            });
        }
    });
    return result;
}

const result = parseMD(fileContent);

const expressions = md2Expressions(result);

expressions.forEach(item => {
    console.log(item);
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// exports
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.parseMD = parseMD;