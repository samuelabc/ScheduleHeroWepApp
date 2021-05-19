require('dotenv').config()
const schedulesRouter = require('express').Router()
const Schedule = require('../models/schedule')
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

schedulesRouter.get('/', async (request, response) => {
    console.log('get schedules for ', request.body)

    //verify user
    const token = await getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    Schedule.find({ username: decodedToken.username }, function (err, data) {
        if (err) {
            console.log(err)
            return response.status(401).json({ error: 'something went wrong' })
        }
        else {
            console.log('found schedules', data)
            response.json(data)
        }
    }
    )
})

schedulesRouter.post('/', async (request, response) => {
    const body = request.body
    console.log('post schedule', body)

    //verify user
    const token = await getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const schedule = new Schedule({
        username: decodedToken.username,
        id: body.id,
        title: body.title,
        content: body.content,
        date: body.date,
        start_time: body.start_time,
        end_time: body.end_time,
        completed: body.completed,
        post_date: new Date()
    })
    console.log(schedule)
    schedule.save(function (err, data) {
        if (err) {
            console.log(err)
            return response.status(401).json({ error: 'something went wrong' })
        }
        else {
            console.log(data)
            response.json(data)
        }
    })
})
schedulesRouter.put('/:old_id', async (request, response) => {
    var old_id = request.params.old_id
    const body = request.body
    console.log('edit schedule', body)
    console.log('username,old_id', old_id)

    //verify user
    const token = await getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    console.log('decodedToken', decodedToken)

    const newSchedule = {
        id: body.new_id,
        title: body.title,
        content: body.content,
        date: body.date,
        start_time: body.start_time,
        end_time: body.end_time,
        completed: body.completed
    }
    try {
        var new_schedule = await Schedule.findOneAndUpdate(
            {
                username: decodedToken.username,
                id: old_id
            },
            newSchedule, { new: true })
        console.log('update schedule success', new_schedule)
        response.json(new_schedule)
    } catch (error) {
        console.log('update schedule failed')
        console.log(error)
        return response.status(401).json({ error: 'something went wrong' })
    }
})
schedulesRouter.delete('/:schedule_id', async (request, response) => {
    const schedule_id = request.params.schedule_id
    console.log('schedule_id', schedule_id)
    console.log('request.body', request.body)
    const body = request.body
    console.log('delete', body)

    //verify user
    const token = await getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    try {
        const deletedSchedule = await Schedule.findOneAndDelete(
            {
                username: decodedToken.username,
                id: schedule_id
            })
        console.log('deletedSchedule', deletedSchedule)
        console.log('delete success')
        response.json({ data: "delete success" })
    }
    catch (error) {
        console.log('delete failed')
        return response.status(401).json({ error: 'delete failed' })
    }
})
schedulesRouter.delete('/', async (request, response) => {
    console.log('request.body', request.body)
    const body = request.body
    console.log('delete', body)

    //verify user
    const token = await getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const username_to_delete = body.username
    if (decodedToken.username !== username_to_delete &&
        decodedToken.user_type !== "admin") {
        return response.status(401).json({ error: 'no permission to delete' })
    }
    try {
        // const scheduleToDelete = await Schedule.find({ username: username })
        // console.log('scheduleToDelete', scheduleToDelete)
        const deletedAllSchedule = await Schedule.deleteMany({ username: username_to_delete })
        console.log('deletedAllSchedule', deletedAllSchedule)
        console.log('delete all schedules of this user success')
        response.json({ data: "delete all schedules of this user successs" })
    }
    catch (error) {
        console.log('delete failed')
        return response.status(401).json({ error: 'delete failed' })
    }
})
module.exports = schedulesRouter