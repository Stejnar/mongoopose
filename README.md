
# Table of contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation) 
4. [Usage](#usage)
5. [Documentation](#documentation)

# Introduction

Mongoopose is very simple and currently provides by far not all of the mongoose api.
It wraps mongoose and behaves like an adapter, based on functional programming patterns 
and Promises to escape the pyramid of doom.

Combining function composition and Promises comes in very handy, when complex database
queries make your head hurt. Your code becomes more readable and easier to reason about, 
because you will start to see how your data flows.

Mongoopose itself has only a few very basic wrapper functions like find, findOne, save and remove, 
but leaves you with a simple possibility to compose every async task into the pipeline.

# Prerequisites

Most likely you would have a basic understanding of functional programming, 
but happily you do not need it to just use it, because the implementation is very straight forward.
  
There is no npm dependency as you can see in package.json, because mongoopose uses 
dependency injection.</br>
In a nutshell... it depends on mongoose, which means you also have a MongoDB setup.

# Installation

    npm install @stejnar/mongoopose

# Usage

Enough talking. Here is some code:
<br/>
<br/>
Simple findOne and update example:
```javascript
    const mongoopose = require('mongoopose')
    const mongoose = require('mongoose')
    
    // initialize mongoose model
    const userSchema = require('./schema')
    const UserModel = mongoose.model('User', userSchema)
    
    // initialize mongoopose model
    const {compose, Params} = mongoopose
    const User = mongoopose.model(UserModel)
    
    // design the queries
    const selectJon = params => Params({select: {email: 'jon-snow@iron-throne.com'}})
    const updateJon = params => Params({query: {$set: {lifes: 2}}})
    
    // composition reads from left to right
    const pipeline = compose(
        User.findOne(selectJon),
        User.update(updateJon)
    )
    pipeline(Params()) // empty initial params
        .then(params => console.log(params)) // params.user => jon 
        .catch(error => console.error(error))
```
Login routine with express.js:
```javascript
router.post('/login', function (req, res) {

    // find user by name and pass as 'user'
    const findUser = params => Params({ select: { name: params.request.name }, as: 'user' })

    // bycrpt compare action for pipeline
    const comparePasswords = (resolve, reject, params) => {
        const { request, user } = params
        bcrypt.compare(request.password, user.password, (err, same) => {
            if (same) {
                const { _id, name } = user
                resolve(params.add(jwt.sign({ _id, name }, 'ssshhhhh secret'), 'token'))
            } else if (err) {
                reject(params.toError({ status: 500 }))
            } else {
                reject(params.toError({ status: 403, message: 'Unequal passwords' }))
            }
        })
    }

    // find additional user data
    const findPhotos = params => Params({ select: { user: params.user._id }, as: 'photos' })

    // initiate pipeline
    const pipeline = compose(
        User.findOne(findUser),
        User.pipe(comparePasswords),
        User.find(findSketches)
    )

    // set initial params
    const params = { request: req.body.payload }

    // handle results or errros
    pipeline(Params(params))
        .then(({ user, token, sketches }) => {
            const { _id: id, name } = user
            res.success(
                'Successfully logged in',
                { user: { id, name }, token, photos }
            );
        })
        .catch(res.error)
});
```

See [functors.test.js](./__tests__/functors.test.js) for more examples

# Documentation

- [mongoopose](#mongoopose)
- [Model](#model)
- [Params](#params)

</br>

## mongoopose

#### mongoopose.model()

Parameters:</br>
A model that gets returned from mongoose.model()

Returns:</br>
*Model*

#### mongoopose.compose()

Parameter:</br>
*...function*, you should only pass findById(), findOne(), find(), save(), update(), remove() and/or pipe()

Returns:</br>
*function(Params)*, that returns a *Promise*

#### mongoopose.Params
</br>

## Model

- Model.findById()
- Model.findOne()
- Model.find()
- Model.save()
- Model.update()
- Model.remove()

**Note:** All methods, but pipe(), take the same input and give the same output.
As follows:

Parameter:</br>
*function(query = Params => Params)*, optional and defaults into no *Params* transformation 
    
Returns:</br>
*function(Params)*, that returns a *Promise*

#### Model.pipe()

Parameter:</br>
*function(action)*, action can be any function that gets **resolve**, **reject** and **params** passed into and **calls** resolve or reject 
    
Returns:</br>
*function(Params)*, that returns a *Promise*

</br>

## Params

#### Params.as 
Type: *String* </br>
Default: mongoose.Model.modelName</br>
This is the key with that a queries result gets assigned to *Params*.
 
#### Params.select
Type: Object </br>
This is the selector that gets passed into mongoose queries.

#### Params.query
Type: Object </br>
This is the update object for Model.update()

#### Params.save
Type: Object </br>
This gets passed into the mongoose model constructor for Model.save().

#### Params.add()

Parameters:</br>
- result *any*,</br>
- name *String*, this is the key with that **result** gets assigned to *Params*


Returns:</br>
*Params*

</br>

#### Params.assign()

Parameters:</br>
obj, *any*

Returns:</br>
*Params*

</br>

#### Params.toError()

Parameters:</br>
- result *any*,</br>
- name *String*


Returns:</br>
*Error* 
