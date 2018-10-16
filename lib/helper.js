const chalk = require('chalk');

/**
 * simply pluralize a string
 * @param string {String}
 * @return {String}
 */
function pluralize(string)
{
    string         = string.toLowerCase();
    const lastChar = string.length - 1;
    if ( string.indexOf('y') !== -1 && string[ lastChar ] === 'y' ) {
        return string.substr(0, lastChar) + 'ies'
    }
    else {
        return string + 's'
    }
}

/**
 * @param search {string}
 * @param replacement {string}
 * @return {string}
 */
String.prototype.replaceAll = function (search, replacement) {
    const target = this;
    return target.split(search).join(replacement);
};

/**
 * @param params {Parameters | Error | {any}}
 * @param done
 */
const printOutput = (params, done) => {
    const tabs = '\t\t\t\t\t\t\t';
    let log    = JSON.stringify(params, (k, v) => {
        return JSON.stringify(v, null, 2)
    }, 2).replaceAll('\\n', `\n ${tabs}`).replaceAll('\\"', '"').replaceAll('"{', '{').replaceAll('}"', '}');
    done();
    console.log(chalk.gray(tabs + 'output: ' + log))
};

/**
 * @param arr {any[] | any[[]]}
 */
function flattenDeep(arr)
{
    return arr.reduce((acc, val) => Array.isArray(val)
        ? acc.concat(flattenDeep(val))
        : acc.concat(val), []);
}

function merge(src, ...dest)
{
    return Object.assign(src, ...dest)
}


/**
 *
 * @type {{pluralize: pluralize, printOutput: (function(Parameters, done))}}
 */
module.exports = { pluralize, printOutput, flattenDeep, merge };