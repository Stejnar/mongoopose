const chalk = require('chalk')

/**
 * simply pluralize a string
 * @param string {String}
 * @return {String}
 */
function pluralize(string) {
    string = string.toLowerCase()
    const lastChar = string.length - 1
    if (string.indexOf('y') !== -1 && string[lastChar] === 'y')
        return string.substr(0, lastChar) + 'ies'
    else
        return string + 's'
}

/**
 * @param search {string}
 * @param replacement {string}
 * @return {string}
 */
String.prototype.replaceAll = function(search, replacement) {
    const target = this
    return target.split(search).join(replacement);
};

/**
 * @param params {Params | Error | {any}}
 * @param done
 */
const printOutput = (params, done) => {
    const tabs = '\t\t\t\t\t\t\t'
    let log = JSON.stringify(params, (k, v) => {
        return JSON.stringify(v, null, 2)
    }, 2).replaceAll('\\n', `\n ${tabs}`).replaceAll('\\"', '"').replaceAll('"{', '{').replaceAll('}"', '}')
    done()
    console.log(chalk.gray(tabs + 'output: ' + log))
}


/**
 *
 * @type {{pluralize: pluralize, printOutput: (function(Params, done))}}
 */
module.exports = {
    pluralize: pluralize,
    printOutput: printOutput
}