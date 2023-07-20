const config = require('../utils/config')
const contactsRouter = require('express').Router()
const Contact = require('../models/contact')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// get token

const getTokenFrom = request => {
    const authorization = request.get('Authorization')
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
contactsRouter.get('/:id', async (request, response) => {
    const contact = await Contact.findById(request.params.id)
        if(contact){
            response.json(contact)
        }else{
            response.status(404).end()
        }
})
//deleting a contact by id
contactsRouter.delete('/:id', async (request, response) => {
    await Contact.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

// posting a contact

contactsRouter.post('/', async (request, response) => {
    const body = request.body
    const decodedToken = jwt.verify(getTokenFrom(request), config.SECRET)
    if(!decodedToken.id) {
        return response.status(401).json({ error:"invalid token" })
    }
    const person = new Contact({
        name:body.name,
        number:body.number,
        user: decodedToken.id
    })
    
    const user = await User.findById(decodedToken.id)
    const savedContact = await person.save()
    user.contacts = user.contacts.concat(savedContact.id)
    await user.save()
    console.log('saved ',person.name)
    response.status(201).json(savedContact)

})

// updating contact in database
contactsRouter.put('/:id', async (request, response) => {
    const decodedToken = jwt.verify(getTokenFrom(request), config.SECRET)
    if(!decodedToken.id) {
        return response.status(401).json({ error:"invalid token" })
    }
    const pid = request.params.id
    const { name, number } = request.body
    const updatedContact = await Contact.findByIdAndUpdate(
        pid,
        { name,number },
        { new:true, runValidators:true, context:'query' })
    response.json(updatedContact)
})

module.exports = contactsRouter