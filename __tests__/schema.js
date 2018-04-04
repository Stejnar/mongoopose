const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    avatar: {
        type: String,
    },
    chats: {
        type: [String]
    },
    users: {
        type: [String]
    }
});

userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) next(err);
        else {
            this.password = hash;
            next();
        }
    });
});

module.exports = userSchema