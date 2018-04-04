const mongoose = require('mongoose')
const userSchema = require('./schema')
const UserModel = mongoose.model('User', userSchema)

const {compose, Params, model: mongoopose} = require('../index')
const Model = mongoopose(UserModel)


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

              
describe('functors tests', () => {
    it('#findOne', (done) => {
        const pipeline = Model.findOne(params => Params({
            select: {email: 'jon-snow@iron-throne.com'},
            as: 'contact'
        }))
        runPipeline(pipeline, done)
    })
    it('#find', (done) => {
        const pipeline = Model.find(params => Params({
            select: {name: {$regex: /Snow/}},
            as: 'Snow Family'
        }))
        runPipeline(pipeline, done)
    })
    it('#save', (done) => {
        const userData = {name: 'Arya Stark', email: 'arya-stark@iron-throne.com', password: 'hallo', avatar: 'tomato'}
        const shouldIntercept = false
        const pipeline = Model.save(params => Params({
            save: shouldIntercept ? null : userData,
            as: 'arya'
        }))
        runPipeline(pipeline, done)
    })
    it('#findById and #update', (done) => {
        const pipeline = compose(
            Model.findById(params => Params({
                select: '5ac533b610d9a3265cfb2e7b',
                as: 'arya'
            })),
            Model.update(params => Params({
                select: {_id: params['arya'].id.toString()},
                query: {$set: {name: 'No one', email: 'no-one@iron-throne.com'}}
            }))
        )
        runPipeline(pipeline, done)
    })
    it('#remove', (done) => {
        const selectArya = {select: {name: 'Arya Stark'}}
        runPipeline(Model.remove(params => Params(selectArya)), done)
    })
})

