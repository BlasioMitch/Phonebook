const Contact = require('../models/contact')

const initialContacts = [
    {
        name:'Mitchell',
        number:73334238,
        user: "64b7cbec9885104539224bb8"
    },
    {
        name:'Nsimbi',
        number:2345232,
        user: "64b7cbec9885104539224bb8"
    }
]

const nonExistingId = async () => {
    const contact = new Contact({ name:'checking soon' })
    await contact.save()
    await contact.deleteOne()

    return contact.id
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