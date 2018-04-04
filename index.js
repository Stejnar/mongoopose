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
 * @type {{model: (function(Model)), compose: (function(...[Function]): function(Params): Promise), Params: Function}}
 */
module.exports = {
    /**
     * @param model
     * @return {{findById: Function, findOne: Function, find: Function, update: Function}}
     */
    model: model => {
        const singular = model.modelName.toLowerCase()
        const plural = pluralize(model.modelName)
        return functors(model, singular, plural)
    },

    /**
     * async compose function
     * @param funcs {...Function}
     * @return {function(Params): Promise}
     */
    compose: (...funcs) => params => (
        funcs.reduce(
            (acc, val) => acc.then(val),
            Promise.resolve(params)
        )
    ),

    /**
     * Params factory
     * @param obj
     * @return {Params}
     */
    Params: Params,
}

