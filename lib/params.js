const { merge } = require('./helper');

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

/**
 * Parameters factory
 * @param obj
 * @return {Params}
 */
module.exports = Params;