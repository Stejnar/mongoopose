import functors      from './lib/functors'
import Params        from './lib/params'
import { pluralize } from "./lib/helper"

/**
 * @type Function
 * @param model
 * @return {{findById: findById, findOne: findOne, find: find, update: update, save: save}}
 */
function model(model)
{
    const singular = model.modelName.toLowerCase()
    const plural   = pluralize(model.modelName)
    return functors(model, singular, plural)
}

/**
 * async compose function
 * @type Function
 * @param funcs {...Function}
 * @return {function(Params): Promise}
 */
function compose(...funcs)
{
    return function (params) {
        funcs.reduce(
            (acc, val) => acc.then(val),
            Promise.resolve(params)
        )
    }
}


export { model, compose, Params }