// ******* Connecting to the mondoDB database**********************
// import mongoose
const mongoose = require('mongoose')


// const url = process.env.MONGODB_URI
const url = process.env.MONGODB_URI
mongoose.set('strictQuery',false)

console.log('connecting to MongoDB...')

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error connecting to MOongoDB: ', error.message)
    })

// create a schema for your documents as a template
const contactSchema = new mongoose.Schema({
    _id:Number,
    name:String,
    number:String
})

contactSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact',contactSchema)