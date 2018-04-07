/**
 * @param pipe {Params}
 * @param query {function(Params)}
 * @param action {function(resolve, reject, Params)}
 * @return {Promise}
 */
function generateQuery(pipe, query, action) {
    return new Promise((resolve, reject) => {
        let params
        try {
            params = pipe.assign(query(pipe))
        } catch (error) {
            console.error(error)
            reject(params.toError(error))
        } finally {
            action(resolve, reject, params)
        }
    })
}

/**
 * @param model {Model}
 * @param singular {string}
 * @param plural {string}
 * @return {{findById: findById, findOne: findOne, find: find, update: update, save: save}}
 */
module.exports = (model, singular, plural) => ({
    /**
     * Model.findById
     * @type Function
     * @param query {function(Params)} [params => params]
     * @return {function(Params): Promise}
     * @api public
     */
    findById: (query = params => params) => pipe =>
        generateQuery(pipe, query, (resolve, reject, params) =>
            model.findById(params.select, (error, result) =>
                error
                    ? reject(params.toError(error))
                    : resolve(params.add(result, params.as || singular))
            )
        ),

    /**
     * Model.findOne
     * @type Function
     * @param query {function(Params)} [params => params]
     * @return {function(Params): Promise}
     * @api public
     */
    findOne: (query = params => params) => pipe =>
        generateQuery(pipe, query, (resolve, reject, params) =>
            model.findOne(params.select, (error, result) =>
                error
                    ? reject(params.toError(error))
                    : resolve(params.add(result, params.as || singular))
            )
        ),

    /**
     * Model.find
     * @type Function
     * @param query {function(Params)} [params => params]
     * @return {function(Params): Promise}
     * @api public
     */
    find: (query = params => params) => pipe =>
        generateQuery(pipe, query, (resolve, reject, params) =>
            model.find(params.select, (error, results) =>
                error
                    ? reject(params.toError(error))
                    : resolve(params.add(results, params.as || plural))
            )
        ),

    /**
     * Model.update
     * @type Function
     * @param query {function(Params)} [params => params]
     * @return {function(Params): Promise}
     * @api public
     */
    update: (query = params => params) => pipe =>
        generateQuery(pipe, query, (resolve, reject, params) =>
            model.update(params.select, params.query, (error, update) =>
                error
                    ? reject(params.toError(error))
                    : resolve(params.add(update, 'update'))
            )
        ),

    /**
     * Model.save
     * @type Function
     * @param query {function(Params)} [params => params]
     * @return {function(Params): Promise}
     * @api public
     */
    save: (query = params => params) => pipe => {
        return generateQuery(pipe, query, (resolve, reject, params) => {
            // interceptor
            if (!params.save)
                resolve(params.add(null, params.as || singular))
            // passed
            const result = new model(params.save)
            result.save(error =>
                error
                    ? reject(params.toError(error))
                    : resolve(params.add(result, params.as || singular))
            )
        })
    },

    /**
     * Model.remove
     * @type Function
     * @param query {function(Params)} [params => params]
     * @return {function(Params): Promise}
     * @api public
     */
    remove: (query = params => params) => pipe =>
        generateQuery(pipe, query, (resolve, reject, params) =>
            model.remove(params.select, (error, result) =>
                error
                    ? reject(params.toError(error))
                    : resolve(params.add(result, 'remove'))
            )
        ),

    /**
     * Model.pipe
     * @type Function
     * @param action {function(resolve, reject, pipe)}
     * @return {function(Params): Promise}
     * @api public
     */
    pipe: action => pipe =>
        new Promise((resolve, reject) => action(resolve, reject, pipe))
})
