const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body // request
    const user = await User.findOne({ username }) // find user by username
    // console.log(user.passwordHash, password)
    const passwordCorrect = 
        user === null ? // if user does not exist
        false :         // password is set as false
        await bcrypt.compare(password, user.passwordHash) // ccreate password hash and compare with what is saved in the database
    
    if (!(user && passwordCorrect)) { // if one of them is wrong
        return response.status(401).json({
            error: 'Invalid username of password'   // send an error status
        })
    }
    const userForToken = {      // credentials to create the token for identity
        username: user.username,
        id: user._id
    }
    const token = jwt.sign(userForToken, config.SECRET) // generate token using SECREt set in env file

    response
        .status(200)
        .send({ token, username: user.username, name: user.name })

})

module.exports = loginRouter