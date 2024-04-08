const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('./test_helper')

const server = require('../app')
const api = supertest(server)
const Contact = require('../models/contact')


beforeEach(async () => {
    await Contact.deleteMany({})
    const contactsObject = helper.initialContacts.map(contact => new Contact(contact))
    const promiseArray =contactsObject.map(contact => contact.save())
    await Promise.all(promiseArray)
    console.log(await helper.contactsInDb())
}, 20000)

describe('Viewing ', () => {

    test('contacts as JSON', async () => {
        await api
        .get('/api/contacts')
        .expect(200)
        .expect('Content-Type',/application\/json/)
    }, 20000)
    
    test('All contacts ', async () => {
        const response = await api.get('/api/contacts')
        
        expect(response.body).toHaveLength(helper.initialContacts.length)
        
        expect(response.body).toHaveLength(helper.initialContacts.length)
        
    },20000)
    
    test('One of the contacts to be Mitchell', async () => {
        const response = await api.get('/api/contacts')
        
        const names = response.body.map(c => c.name)
        expect(names).toContain('Mitchell')
    },20000)

    test('view specific contact', async () => {
        const prevContacts = await helper.contactsInDb()
        const contactToView = prevContacts[0]
        const resultContact = await api 
            .get(`/api/contacts/${contactToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        expect(resultContact.body).toEqual(contactToView)
    },20000)
    
})

describe('Adding  ', () => {

    test('a valid contact ', async () => {
        const newContact = {
            name:'Joanita',
            number: 323124
            
        }
        await api
        .post('/api/contacts')
        .send(newContact)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        
        const newContacts = await helper.contactsInDb()
        expect(newContacts).toHaveLength(helper.initialContacts.length + 1)
        
        const names = newContacts.map(c => c.name)
        expect(names).toContain('Joanita')
    }, 20000)
    
    test('a contact without name not added', async () => {
        const newContact = {
            number:'8937849'
        }
        await api
        .post('/api/contacts')
        .send(newContact)
        .expect(400)
        
        const response = await helper.contactsInDb()
        expect(response).toHaveLength(helper.initialContacts.length)
    },20000)
    
    test('a contact without number ', async () => {
        const newContact = {
            name:'Ashok'
        }
        await api
        .post('/api/contacts')
        .send(newContact)
        .expect(400)
        
        const response = await helper.contactsInDb()
        expect(response).toHaveLength(helper.initialContacts.length)
        
    },20000)
})


test('delete a contact', async () => {
    const prevContacts = await helper.contactsInDb()
    const contactToDelete = prevContacts[1]
    await api
    .delete(`/api/contacts/${contactToDelete.id}`)
    .expect(204)

    const contactsAfter = await helper.contactsInDb()
    expect(contactsAfter).toHaveLength(helper.initialContacts.length - 1)

    const names = contactsAfter.map(c => c.name)
    expect(names).not.toContain(contactToDelete.name)
},20000)


afterAll(async () => {
    await mongoose.connection.close()
})
