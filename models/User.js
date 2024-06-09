const mongoose = require('mongoose')

const UserModel = mongoose.model('User',{
    id: String,
    name: String,
    email: String,
    occupation: String,
    password: String
})

module.exports = UserModel