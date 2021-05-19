const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
    username: String,
    id: String,
    title: String,
    content: String,
    date: String,
    start_time: String,
    end_time: String,
    completed: String,
    post_date: String,
})

// scheduleSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//         returnedObject.id = returnedObject._id.toString()
//         delete returnedObject._id
//         delete returnedObject.__v
//     }
// })
module.exports = mongoose.model('Schedule', scheduleSchema)