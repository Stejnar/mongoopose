const functors = require('./lib/functors')
const Params = require('./lib/params')

/**
 * simply pluralize a string
 * @param string {string}
 * @return {string}
 */
function pluralize(string) {
    const upper = string.toUpperCase()
    const lastChar = upper.length - 1
    if (upper.indexOf('Y') !== -1 && upper[lastChar] === 'Y')
        return string.substr(0, lastChar) + 'ies'
    else
        return string + 's'
}

/**
 *
 * @param model
 * @return {{
 *  compose: Function,
 *  findOne: Function,
 *  find: Function,
 *  findById: Function,
 *  update: Function,
 *  Params: Params
 * }}
 */
module.exports = model => {
    const singular = model.modelName.toLowerCase()
    const plural = pluralize(model.modelName.toLowerCase())
    const {compose, findOne, find, findById, update} = functors(model, singular, plural)
    return {compose, findOne, find, findById, update, Params}
}