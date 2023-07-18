const config = require('../utils/config')
const contactsRouter = require('express').Router()
const Contact = require('../models/contact')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// get token
const getTokenFrom = request => {
    const authorization = request.get('authorizaton')
    if(authorization && authorization.startsWith('Bearer ')){
        return authorization.replace('Bearer ','')
    }
    return null
}


// returns all documents ({}) in the collection
contactsRouter.get('/', async (request, response) => {
    const contacts = await Contact.find({}).populate('user',{ name:1, username:1 })
    response.json(contacts)
    })

// to information page
contactsRouter.get('/info', (request, response) => {
    const numberPersons = Contact.find({}).length
    const today = new Date()
    response.send(`
    <p>Your Phonebook has ${numberPersons} people</p>
    <p>${today}</p>
    `)
})
// fetching contact by id
contactsRouter.get('/:id', (request, response, next) => {
    const pid = request.params.id
    Contact.findById(pid)
        .then(contact => {
            if(contact){
                response.json(contact)
            }else{
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})
//deleting a contact by id
contactsRouter.delete('/:id', (request, response,next) => {
    const pid = request.params.id
    Contact.findByIdAndDelete(pid)
        .then(() =>  response.status(204).end())
        .catch(error => next(error))
})

// posting a contact
contactsRouter.post('/', async (request, response, next) => {
    const body = request.body
    const decodedToken = jwt.verify(getTokenFrom(request), config.SECRET)
    if(!decodedToken.id) {
        return response.status(401).json({ error:"invlaid token" })
    }

    const user = await User.findById(decodedToken.id)
    const person = new Contact({
        name:body.name,
        number:body.number,
        _id:body.id,
        user: user.id
    })
    try{
        const savedContact = await person.save()
        user.contacts = user.contacts.concat(savedContact._id)
        await user.save()
        console.log('saved ',person.name)
        response.status(201).json(savedContact)
    } catch (exception) {
        next(exception)
    }
})

// updating contact in database
contactsRouter.put('/:id', (request, response, next) => {
    const pid = request.params.id
    const { name, number } = request.body
    Contact.findByIdAndUpdate(
        pid,
        { name,number },
        { new:true, runValidators:true, context:'query' }
    ).then(updatedContact => {
        response.json(updatedContact)
    }).catch(error => next(error))
})

module.exports = contactsRouter