// import mongoose
const mongoose = require('mongoose')

// create a schema for your documents as a template
const contactSchema = new mongoose.Schema({
    _id:Number,
    name:{
        type: String,
        minLength: 2,
        required: true
    },
    number:{
        type: String,
        minLength: 5,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.Number,
        ref: 'User'
    }
})

contactSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact',contactSchema)