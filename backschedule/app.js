const express = require('express')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const schedulesRouter = require('./controllers/schedules')
const mongoose = require('mongoose')

const url = process.env.MONGO_URL
console.log('connecting to ', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        console.log('connected to MongoDB')
    }).catch((error) => {
        console.log('error connection to MongoDB: ', error.message)
    })

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use('/users', usersRouter)
app.use('/schedules', schedulesRouter)

module.exports = app