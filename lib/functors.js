/**
 * @param pipe {Params}
 * @param query {function(Params)}
 * @param action {function(resolve, reject, Params)}
 * @return {Promise}
 */
function generateQuery(pipe, query, action) {
    const params = pipe.assign(query(pipe))
    return new Promise((resolve, reject) => action(resolve, reject, params))
}

/**
 * @param error {{any}}
 * @param params {Params}
 * @return {Error}
 */
function toError(error, params) {
    return new Error(JSON.stringify(params.add(error, 'error'), null, 2))
}

// noinspection JSUnresolvedFunction
/**
 * @param model {Model}
 * @param singular {string}
 * @param plural {string}
 * @return {{compose: Function, findById: Function, findOne: Function, find: Function, update: Function}}
 */
module.exports = (model, singular, plural) => ({
    /**
     * Model.findById
     * @param query {function(Params)}
     * @return {function(Params)}
     */
    findById: query => pipe =>
        generateQuery(pipe, query, (resolve, reject, params) =>
            model.findById(params.select, (error, result) => {
                if (error)
                    reject(toError(error, params))
                else
                    resolve(params.add(result, params.as || singular))
            })
        ),

    /**
     * Model.findOne
     * @param query {function(Params)}
     * @return {function(Params)}
     */
    findOne: query => pipe =>
        generateQuery(pipe, query, (resolve, reject, params) =>
            model.findOne(params.select, (error, result) => {
                if (error)
                    reject(toError(error, params))
                else
                    resolve(params.add(result, params.as || singular))
            })
        ),

    /**
     * Model.find
     * @param query {function(Params)}
     * @return {function(Params)}
     */
    find: query => pipe =>
        generateQuery(pipe, query, (resolve, reject, params) =>
            model.find(params.select, (error, results) => {
                if (error)
                    reject(toError(error, params))
                else
                    resolve(params.add(results, params.as || plural))
            })
        ),

    /**
     * Model.update
     * @param query {function(Params)}
     * @return {function(Params)}
     */
    update: query => pipe =>
        generateQuery(pipe, query, (resolve, reject, params) =>
            model.update(params.select, params.query, (error, update) => {
                if (error)
                    reject(toError(error, params))
                else
                    resolve(params.add(update, 'update'))
            })
        ),
})