const functors                   = require('./lib/functors');
const Params                     = require('./lib/params');
const { pluralize, flattenDeep } = require("./lib/helper");


/**
 * @type {{
 *     model: (function(Model)),
 *     compose: (function(...[Function]): function(Params): Promise),
 *     Parameters: Function
 * }}
 */
module.exports = {
    /**
     * @type Function
     * @param model
     * @return {{
     *     findById: findById,
     *     findOne: findOne,
     *     find: find,
     *     update: update,
     *     save: save
     * }}
     */
    model: function (model) {
        if ( !model ) {
            throw new Error('No Arguments provided. ' + '\n' +
                'mongoopose.model expects 1 argument of type Mongoose.Model')
        }
        if ( !model.modelName ) {
            throw new Error('Type Error.' + '\n' +
                'mongoopose.model expects 1 argument of type Mongoose.Model')
        }

        const singular = model.modelName.toLowerCase();
        const plural   = pluralize(model.modelName);

        return functors(model, singular, plural);
    },

    /**
     * async compose function
     * @type Function
     * @param funcs {...Function}
     * @return {function(Params): Promise}
     */
    compose: function (...funcs) {
        return function (params) {
            funcs = flattenDeep(funcs);
            return funcs.reduce(
                (acc, val) => acc.then(val),
                Promise.resolve(params)
            );
        }
    },

    /**
     * Parameters factory
     * @type Params
     */
    Params: Params,
};

