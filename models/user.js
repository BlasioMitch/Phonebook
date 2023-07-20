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
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Contact'
        }
    ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)
