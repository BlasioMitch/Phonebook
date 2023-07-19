const Contact = require('../models/contact')

const initialContacts = [
    {
        _id:1,
        name:'Mitchell',
        number:'739238',
        contacts: [1,3,4]
    },
    {
        _id:2,
        name:'Nsimbi',
        number:'2345232',
        contacts: [2,5,6]
    }
]

const nonExistingId = async () => {
    const contact = new Contact({ name:'checking soon' })
    await contact.save()
    await contact.deleteOne()

    return contact._id
}

const contactsInDb = async () => {
    const contacts = await Contact.find({})
    return contacts.map(contact => contact.toJSON())
}

module.exports = {
    initialContacts,
    nonExistingId,
    contactsInDb
}