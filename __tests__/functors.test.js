const mongoopose = require('../index')
const mongoose = require('mongoose')
const userSchema = require('./schema')
const UserModel = mongoose.model('User', userSchema)
const {compose, findOne, find, Params} = mongoopose(UserModel)


beforeEach('connect to db', () => {
    const conn = mongoose.connect('mongodb://127.0.0.1:4001/chat')
})

describe('functors test', () => {
    it('findOne', (done) => {
        const pipeline = compose(
            findOne(params => Params({
                select: {email: 'jon-snow@iron-throne.com'},
                as: 'contact'
            }))
        )
        pipeline(Params())
            .then((params) => {
                // console.log(JSON.stringify(params, null, 2))
                done()
            })
            .catch(err => done(err))
    })
    it('find', (done) => {
        const pipeline = compose(
            find(params => Params({
                select: {name: {$regex: /Snow/}},
                as: 'Snow Family'
            }))
        )
        pipeline(Params())
            .then((params) => {
                // console.log(JSON.stringify(params, null, 2))
                done()
            })
            .catch(err => done(err))
    })
})

