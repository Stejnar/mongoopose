const functors = require('./lib/functors')
const Params = require('./lib/params')

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
 *
 * @param model
 * @return {{compose: Function, findById: Function, findOne: Function, find: Function, update: Function, Params: Params}}
 */
module.exports = model => {
    const singular = model.modelName.toLowerCase()
    const plural = pluralize(model.modelName)
    const {compose, findOne, find, findById, update} = functors(model, singular, plural)
    return {compose, findOne, find, findById, update, Params}
}