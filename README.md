# mongoopose

This module provides a simple api, to compose mongoose database queries.

### Table of contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation) 
4. [Usage](#usage)
5. [Documentation](#documentation)

## Introduction

Mongoopose is very simple and currently provides by far not all of the mongoose api.
It wraps mongoose and behaves like an adapter, based on functional programming patterns 
and Promises to escape the pyramid of doom.

Combining function composition and Promises comes in very handy, when complex database
queries make your head hurt. Your code becomes more readable and easier to reason about, 
because you will start to see how your data flows.

Mongoopose itself has only a few very basic wrapper functions like find, findOne, save and remove, 
but leaves you with a simple possibility to compose every async task into the pipeline.

## Prerequisites

Most likely you would have a basic understanding of functional programming, 
but happily you do not need it to just use it, because the implementation is very straight forward.
  
There is no npm dependency as you can see in package.json, because mongoopose uses 
dependency injection.</br>
In a nutshell... it depends on mongoose, which means you also have a MongoDB setup.

## Installation

There is no npm package at the moment!</br>
So this is the way to go:

    npm install git@https://github.com/Stejnar/mongoopose.git

## Usage

Enough talking. Here is some code:

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
See [functors.test.js](./__tests__/functors.test.js) for more examples

## Documentation

Coming soon!
