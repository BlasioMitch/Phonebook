const express = require('express')
const cors = require('cors')
const server = express()

require('dotenv').config()
const Contact = require('./models/contact')

const mongoose = require('mongoose')
// create a model from your schema to be used to create documents from applcaition
// It creates contacts collection in the database using the schema
// const Contact = mongoose.model('Contact',contactSchema)


const requestLogger = (request, response, next) =>{
    console.log('Method: ', request.method)
    console.log('path: ', request.path)
    console.log('Body: ', request.body)
    console.log('Mitchell done...')
    next()
}

const errorHandler = ( error, request, response, next ) =>{
    console.error(error.message)
    if (error.name === 'CastError'){
        return response.status(400).send({error:"Malformatted ID used"})
    }
    next(error)
}
const unknownEndpoint = (request, response) =>{
    response.status(404).send({
        error:'unknown endpoint'
    })
}

server.use(cors())
server.use(express.json())
server.use(requestLogger)
server.use(express.static('build'))

// Fetching current state of database to backend
let persons = []
Contact.find({}).then(r => r.forEach(p =>{
    persons = persons.concat(p)
}))
    
// server routes
    
server.get('/', (request, response) => {
    response.send('<h1>Welcome to the backend server for your phone book app</h1>')
})

server.get('/api/contacts', (request, response) => {
    // returns all documents ({}) in the collection
    Contact.find({}).then(contacts => {
        response.json(contacts)
    })

})

server.get('/info', (request, response) => {
    const numberPersons = Contact.find({}).length
const today = new Date()
response.send(`
<p>Your Phonebook has ${numberPersons} people</p>
<p>${today}</p>
`)
})

server.get('/api/contacts/:id', (request, response, next) => {
    const pid = request.params.id
    Contact.findById(pid)
        .then(contact =>{
            if(contact){
                response.json(contact)
            }else{
                response.status(404).end()
            }
        })
        .catch(error =>next(error))
})

server.delete('/api/contacts/:id', (request, response,next) => {
    const pid = request.params.id
    Contact.findByIdAndDelete(pid)
        .then(contact =>  response.status(204).end())
        .catch(error => next(error))
})


server.post('/api/contacts/', (request, response) =>{
    const body = request.body
    // const exp = persons.filter
    if (!body.name){
        return response.status(400).json({
            error:'name is missing'
        })
        
    }else if(!body.number){
        return response.status(400).json({
            error:'number is missing'
        })
    }else if(persons.find(p => p.name === body.name)){
        return  response.status(400).json({
            error: `${body.name} exists`
        })
    }else{
        const person = new Contact({
            name:body.name,
            number:body.number,
            _id:body.id
            // _id:maxID() +1
        })
        person.save().then(sn => {
            console.log(sn.id,' saved ',person.name)
            response.json(sn)
        }).catch(err =>{
            response.status(400).json({error:'unable to save'})
        })

        // persons = persons.concat(person)
        // response.json(person)
    }
})

// updating document in database
server.put('/api/contacts/:id', (request, response, next) =>{
    const pid = request.params.findById
    const body = request.body
    const contact = {
        name:body.name,
        number:body.number
    }
    Contact.findByIdAndUpdate(pid,contact,{new:true})
        .then(updatedContact =>{
            response.json(updatedContact)
        })
        // .catch(error=>console.error(error.message))
        .catch(error => next(error))
})

server.use(unknownEndpoint)
server.use(errorHandler)

const PORT = process.env.PORT

server.listen(PORT, () => {
    console.log(`Welcome to this Server running at Port ${PORT}`)
})