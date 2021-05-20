const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const getTokenFrom = async (request) => {
    const authorization = await request.get('authorization')
    console.log('authorization', authorization)
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

usersRouter.get('/', async (request, response) => {
    console.log('get users', request.body)

    //verify user
    const token = await getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (decodedToken.user_type !== "admin") {
        return response.status(401).json({ error: 'permission error' })
    }

    try {
        const users = await User.find({})
        const retUsers = await users.map(user => user)
        console.log(users)
        response.json({ data: users })
    }
    catch (error) {
        console.log(err)
        return response.status(401).json({ error: 'get users failed' })
    }
})
usersRouter.post('/login', async (request, response) => {
    const body = request.body
    console.log('login', body)

    //check username and password correct
    const user = await User.findOne({ username: body.username })
    console.log('user', user)
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.password)
    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    //create jwt token
    const userForToken = {
        username: user.username,
        id: user._id,
        user_type: user.user_type
    }
    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60 * 60 * 24 }
    )

    console.log(user)
    if (user) {
        response.json({
            data:
            {
                token: token,
                username: user.username,
                user_type: user.user_type,
                register_date: user.register_date
            }
        })
    }
    else {
        response.status(401).json({ error: "wrong username or password " })
    }
})
usersRouter.post('/register', async (request, response) => {
    const body = request.body
    console.log('register', body)

    //check if username exist
    const alreadyRegister = await User.findOne({ username: body.username })
    if (alreadyRegister) {
        response.status(404).json({ error: "username has been taken." })
        return
    }

    //create passwordhash
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        password: passwordHash,
        register_date: body.register_date,
        user_type: "user",
    })
    user.save(function (err, data) {
        if (err) {
            console.log(err)
            return err
        }
        else {
            console.log(data)
            response.json({
                username: data.username,
                user_type: data.user_type,
                register_date: data.register_date
            })
        }
    })
})

usersRouter.put('/changepassword', async (request, response) => {
    const body = request.body
    console.log('changepassword', body)

    //verify user
    const token = await getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    //check username and password correct
    const user = await User.findById(decodedToken.id)
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.oldpassword, user.password)
    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid password'
        })
    }
    console.log('user', user)

    //create passwordhash
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.newpassword, saltRounds)

    const newUser = {
        password: passwordHash,
    }

    try {
        await User.findByIdAndUpdate(decodedToken.id, newUser, { new: true })
        console.log('update success')
        response.json({ data: "update success" })
    } catch (e) {
        console.log('update failed')
        console.log(e)
        return response.status(401).json({ error: 'change password failed, something went wrong' })
    }
})

usersRouter.delete('/', async (request, response) => {
    console.log('request.body', request.body)
    const body = request.body
    console.log('delete', body)

    //verify user
    const token = await getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    //check username and password correct
    if (decodedToken.user_type !== "admin") {
        const user = await User.findById(decodedToken.id)
        const passwordCorrect = user === null
            ? false
            : await bcrypt.compare(body.password, user.password)
        if (!(user && passwordCorrect)) {
            return response.status(401).json({
                error: 'invalid password'
            })
        }
    }

    const username_to_delete = body.username
    if (decodedToken.username !== username_to_delete &&
        decodedToken.user_type !== "admin") {
        return response.status(401).json({ error: 'no permission to delete' })
    }

    //delete user from db
    try {
        await User.findOneAndDelete({ username: username_to_delete })
        console.log('delete user success')
        response.json({ data: "delete success" })
    }
    catch (error) {
        console.log('delete user failed')
        response.json({ error: "wrong password" });
    }
})
module.exports = usersRouter