const mongoose = require('mongoose')
const supertest = require('supertest')
const server = require('../app')
const api = supertest(server)
const Contact = require('../models/contact')


const initialContacts = [
    {
        name:'Mitchell',
        number:'739238',
        _id:1
    },
    {
        name:'Nsimbi',
        number:'2345232',
        _id:2
    }
]

beforeEach(async () => {
    await Contact.deleteMany({})
    let contactObject = new Contact(initialContacts[0])
    await   contactObject.save()
    contactObject = new Contact(initialContacts[1])
    await contactObject.save()
}, 20000)

test('Tests are returned as JSON', async () => {
    await api
    .get('/api/contacts')
    .expect(200)
    .expect('Content-Type',/application\/json/)
}, 20000)

test('All contacts are returned ', async () => {
    const response = await api.get('/api/contacts')
    expect(response.body).toHaveLength(initialContacts.length)
})
test('One of the contacts to be Mitchell', async () => {
    const response = await api.get('/api/contacts')

    const names = response.body.map(c => c.name)
    expect(names).toContain('Mitchell')
})

test('to add a valid contact ', async () => {
    const newContact = {
        name:'Joan',
        number: '323124',
        _id:3
    }
    await api
    .post('/api/contacts')
    .send(newContact)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response =    await api.get('/api/contacts')
    const names = response.body.map(c => c.name)
    expect(response.body).toHaveLength(initialContacts.length + 1)
    expect(names).toContain('Joan')
})

test('contact without name not added', async () => {
    const newContact = {
        number:'8937849',
        _id:3
    }
    await api
    .post('/api/contacts')
    .send(newContact)
    .expect(400)

    const response = await api.get('/api/contacts')
    expect(response.body).toHaveLength(initialContacts.length)
})

test('contact without number not added', async () => {
    const newContact = {
        name:'Ashok',
        _id:3
    }
    await api
    .post('/api/contacts')
    .send(newContact)
    .expect(400)

    const response = await api.get('/api/contacts')
    expect(response.body).toHaveLength(initialContacts.length)
})

afterAll(async () => {
    await mongoose.connection.close()
})
