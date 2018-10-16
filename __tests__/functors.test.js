const { printOutput } = require("../lib/helper");
const mongoopose      = require('../index');
const mongoose        = require('mongoose');

const userSchema = require('./schema');
const UserModel  = mongoose.model('User', userSchema);

const { compose, Params } = mongoopose;
const User                = mongoopose.model(UserModel);

const runPipeline = (pipeline, done) =>
    pipeline(Params())
        .then(params => printOutput(params, done))
        .catch(err => printOutput(err, done));


beforeEach('connect to db', () => {
    const conn = mongoose.connect('mongodb://127.0.0.1:4001/chat')
});

describe('functors tests', () => {
    it('#findOne', (done) => {
        const selectJonAsContact = params => Params({ select: { email: 'jon-snow@iron-throne.com' }, as: 'contact' });
        const pipeline           = User.findOne(selectJonAsContact);
        runPipeline(pipeline, done)
    });


    it('#find', (done) => {
        const findSnowFamily = params => Params({ select: { name: { $regex: /Snow/ } }, as: 'Snow Family' });
        const pipeline       = User.find(findSnowFamily);
        runPipeline(pipeline, done)
    });


    it('#save', (done) => {
        const shouldIntercept = false;
        const userData        = {
            name:     'Arya Stark',
            email:    'arya-stark@iron-throne.com',
            password: 'hallo',
            avatar:   'tomato'
        };
        const saveArya        = params => Params({ save: shouldIntercept ? null : userData, as: 'arya' });
        const pipeline        = User.save(saveArya);
        runPipeline(pipeline, done)
    });


    it('#findById and #update', (done) => {
        const selectArya = params => Params({ select: '5ac533b610d9a3265cfb2e7b', as: 'arya' });
        const updateArya = params => Params({
            select: { _id: params[ 'arya' ].id.toString() },
            query:  { $set: { name: 'No one', email: 'no-one@iron-throne.com' } }
        });
        const pipeline   = compose(
            User.findById(selectArya),
            User.update(updateArya)
        );
        runPipeline(pipeline, done)
    });


    it('#remove', (done) => {
        const selectArya = params => Params({ select: { name: 'Arya Stark' } });
        runPipeline(User.remove(selectArya), done)
    })
});

