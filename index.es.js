import { flattenDeep, merge, pluralize } from "./lib/helper";
import functors                          from './lib/functors'


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
function model(model)
{
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
        funcs = flattenDeep(funcs);
        return funcs.reduce(
            (acc, val) => acc.then(val),
            Promise.resolve(params)
        );
    }
}


/**
 * Parameters factory
 * @type Params
 * @param obj {Object}
 */
function Params(obj)
{
    /**
     * @property as {{any}}
     * @property select {{any}}
     * @property query {{any}}
     * @property query {{any}}
     */
    class Parameters {
        constructor()
        {
            this.as     = undefined;
            this.select = undefined;
            this.query  = undefined;
            this.save   = undefined;
        }

        /**
         * @param result {{any}}
         * @param name {string}
         * @return {Parameters}
         */
        add(result, name)
        {
            if ( this[ name ] ) {
                if ( Array.isArray(this[ name ]) ) {
                    return merge(this, { [ name ]: this[ name ].concat(result) });
                }
                else {
                    return merge(this, { [ name ]: [].concat(this[ name ], result) })
                }
            }
            else {
                return merge(this, { [ name ]: result })
            }
        }

        /**
         * @param obj {{any}}
         * @return {Parameters}
         */
        assign(obj)
        {
            return merge(this, { as: undefined }, obj)
        }

        /**
         * @param error {Error | string | {any}}
         * @return {Error}
         */
        toError(error)
        {
            return new Error(JSON.stringify(this.add(error, 'error'), null, 2))
        }
    }

    return merge(new Parameters(), obj)
}

export { model, compose, Params }