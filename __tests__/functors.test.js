const mongoopose = require('../index')
const mongoose = require('mongoose')
const userSchema = require('./schema')
const UserModel = mongoose.model('User', userSchema)
const {compose, findOne, find, Params} = mongoopose(UserModel)


const printToConsole = (params, done) => {
    console.log(JSON.stringify(params, null, 2))
    done()
}


const runPipeline = (pipeline, done) => 
    pipeline(Params())
        .then(params => printToConsole(params, done))
        .catch(err => printToConsole(err, done))


beforeEach('connect to db', () => {
    const conn = mongoose.connect('mongodb://127.0.0.1:4001/chat')
})

              
describe('functors', () => {
    it('#findOne', (done) => {
        const pipeline = compose(
            findOne(params => Params({
                select: {email: 'jon-snow@iron-throne.com'},
                as: 'contact'
            }))
        )
        runPipeline(pipeline, done)
    })
    it('#find', (done) => {
        const pipeline = compose(
            find(params => Params({
                select: {name: {$regex: /Snow/}},
                as: 'Snow Family'
            }))
        )
        runPipeline(pipeline, done)
    })
})

