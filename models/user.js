const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// user schema

const userSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true,
        unique: true
        },
    name: String,
    passwordHash: String,
    contacts:[
        {
            type : mongoose.Schema.Types.Number,
            ref : 'Contact'
        }
    ],
    _id: Number
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)
