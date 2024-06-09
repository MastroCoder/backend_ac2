const mongoose = require('mongoose')

const TaskModel = mongoose.model('Task', {
    id: String,
    owner: String,
    description: String,
    isDone: Boolean
})

module.exports = TaskModel

