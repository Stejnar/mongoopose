const { pluralize, printOutput, flattenDeep, merge } = require("../lib/helper");
const assert                                         = require("assert");

describe('helpers tests', () => {
    it('#flattenDeep should flatten', () => {
        function c(...funcs)
        {
            funcs = flattenDeep(funcs);
            assert.equal(funcs[ 0 ](), 'hello');
            assert.equal(funcs[ 1 ](), 'world');
        }

        c([ () => 'hello', [ () => 'world' ] ])
    });

    it('#flattenDeep should not flatten', () => {
        function c(...funcs)
        {
            funcs = flattenDeep(funcs);
            assert.equal(funcs[ 0 ](), 'hello');
            assert.equal(funcs[ 1 ](), 'world');
        }

        c(() => 'hello', () => 'world')
    });

    it('#merge should also merge arrays', () => {
        const a = { d: 'hello' };
        const b = merge(a, { d: 'happy' }, { a: 'world' });
        assert.deepEqual({ d: 'happy', a: 'world' }, b);
    });

    it('#pluralize(\'user\')\t should return \'users\'', () => {
        assert.equal(pluralize('user'), 'users')
    });

    it('#pluralize(\'entity\')\t should return \'entities\'', () => {
        assert.equal(pluralize('entity'), 'entities')
    });

    it('#printOutput\t\t\t should print formatted json data', (done) => {
        const obj = {
            select: {
                _id: "5ac533b610d9a3265cfb2e7b"
            },
            query:  {
                $set: {
                    name:  "No one",
                    email: "no-one@iron-throne.com"
                }
            },
            arya:   {
                chats:    [],
                users:    [],
                _id:      "5ac533b610d9a3265cfb2e7b",
                name:     "No one",
                email:    "no-one@iron-throne.com",
                password: "$2a$10$nE0cHnhWYIjXBmoKiEpRK.YQbIK/TZ7pAO4zaWDMaykSKmK3u/ewW",
                avatar:   "tomato",
                __v:      0
            },
            update: {
                n:         1,
                nModified: 0,
                ok:        1
            }
        };
        printOutput(obj, done)
    })
});