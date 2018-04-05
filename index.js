const functors = require('./lib/functors')
const Params = require('./lib/params')
const {pluralize} = require("./lib/helper");



/**
 * @type {{model: (function(Model)), compose: (function(...[Function]): function(Params): Promise), Params: Function}}
 */
module.exports = {
    /**
     * @type Function
     * @param model
     * @return {{findById: findById, findOne: findOne, find: find, update: update, save: save}}
     */
    model: model => {
        const singular = model.modelName.toLowerCase()
        const plural = pluralize(model.modelName)
        return functors(model, singular, plural)
    },

    /**
     * async compose function
     * @type Function
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
     * @type Params
     */
    Params: Params,
}

