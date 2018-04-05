/**
 * Params factory
 * @param obj
 * @return {Params}
 */
module.exports = (obj) => Object.assign(new Params(), obj)

/**
 * @property as {{any}}
 * @property select {{any}}
 * @property query {{any}}
 * @property query {{any}}
 */
class Params {
    constructor() {
        this.as = undefined
        this.select = undefined
        this.query = undefined
        this.save = undefined
    }

    /**
     * @param result {{any}}
     * @param name {string}
     * @return {Params}
     */
    add(result, name) {
        if (this[name]) {
            if (Array.isArray(this[name]))
                return Object.assign(this, {[name]: this[name].concat(result)})
            else
                return Object.assign(this, {[name]: [].concat(this[name], result)})
        } else
            return Object.assign(this, {[name]: result})
    }

    /**
     * @param obj {{any}}
     * @return {Params}
     */
    assign(obj) {
        return Object.assign(this, {as: undefined}, obj)
    }

    /**
     * @param error {Error | string | {any}}
     * @return {Error}
     */
    toError(error) {
        return new Error(JSON.stringify(this.add(error, 'error'), null, 2))
    }
}